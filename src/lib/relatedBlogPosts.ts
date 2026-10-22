export interface RelatedBlogTopic {
  title: string;
  excerpt?: string;
  category?: string;
}

export interface RelatedBlogPost extends RelatedBlogTopic {
  slug: string;
  publishedAt: string;
}

const STOP_WORDS = new Set(
  "a ao aos as com como da das de do dos e em entre esse essa este esta isso mais na nas no nos o os ou para pela pelo por que se sem seu seus sua suas um uma uns umas voce voces codexy".split(" ")
);

function weightedTerms(topic: RelatedBlogTopic): Map<string, number> {
  const terms = new Map<string, number>();
  const fields: Array<[string, number]> = [
    [topic.title, 4],
    [topic.category ?? "", 2],
    [topic.excerpt ?? "", 1],
  ];

  for (const [text, weight] of fields) {
    const words = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/[^a-z0-9]+/);
    for (const word of new Set(words)) {
      if (word.length < 3 || STOP_WORDS.has(word)) continue;
      const term = word.length > 4 ? word.replace(/s$/, "") : word;
      terms.set(term, Math.max(terms.get(term) ?? 0, weight));
    }
  }

  return terms;
}

export function selectRelatedBlogPosts<T extends RelatedBlogPost>(
  posts: readonly T[],
  topic: RelatedBlogTopic,
  { excludeSlug, limit = 3 }: { excludeSlug?: string; limit?: number } = {}
): T[] {
  const uniquePosts = [...new Map(posts.filter((post) => post.slug !== excludeSlug).map((post) => [post.slug, post])).values()];
  const candidates = uniquePosts.map((post) => ({ post, terms: weightedTerms(post) }));
  const documentFrequency = new Map<string, number>();
  for (const { terms } of candidates) {
    for (const term of terms.keys()) documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
  }

  const queryTerms = weightedTerms(topic);
  return candidates
    .map(({ post, terms }) => ({
      post,
      score: [...queryTerms].reduce((score, [term, weight]) => {
        // Termos presentes em poucos artigos distinguem melhor o assunto.
        const rarity = Math.log(1 + candidates.length / (documentFrequency.get(term) ?? 1));
        return score + weight * (terms.get(term) ?? 0) * rarity;
      }, 0),
    }))
    .sort((a, b) =>
      b.score - a.score ||
      (a.post.publishedAt < b.post.publishedAt ? 1 : a.post.publishedAt > b.post.publishedAt ? -1 : 0) ||
      (a.post.slug < b.post.slug ? -1 : a.post.slug > b.post.slug ? 1 : 0)
    )
    .slice(0, Math.max(0, Math.floor(limit)))
    .map(({ post }) => post);
}
