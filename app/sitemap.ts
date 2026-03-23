import { MetadataRoute } from 'next'

const BASE_URL = 'https://prep4place.com'

const PATTERN_SLUGS = [
    'prefix-sum',
    'two-pointers',
    'sliding-window',
    'fast-slow-pointers',
    'linked-list-reversal',
    'monotonic-stack',
    'top-k-elements',
    'overlapping-intervals',
    'modified-binary-search',
    'binary-tree-traversal',
    'dfs',
    'bfs',
    'matrix-traversal',
    'backtracking',
    'dynamic-programming',
]

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date().toISOString()

    const staticPages: MetadataRoute.Sitemap = [
        // Homepage
        { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },

        // Core content — high priority
        { url: `${BASE_URL}/patterns`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${BASE_URL}/roadmap`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
        { url: `${BASE_URL}/roadmap/blind-75`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${BASE_URL}/roadmap/dsa-patterns`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/compiler`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

        // Blog — high priority (content Google can rank)
        { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/blog/blind-75-leetcode-problems-complete-guide-2025`, lastModified: '2025-01-25', changeFrequency: 'monthly', priority: 0.95 },
        { url: `${BASE_URL}/blog/top-50-dsa-questions-for-placements-2025`, lastModified: '2025-02-01', changeFrequency: 'monthly', priority: 0.9 },

        // Visualizer
        { url: `${BASE_URL}/visualizer`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/visualizer/bubble-sort`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${BASE_URL}/visualizer/selection-sort`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/visualizer/insertion-sort`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/visualizer/merge-sort`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${BASE_URL}/visualizer/quick-sort`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${BASE_URL}/visualizer/binary-search`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${BASE_URL}/visualizer/linear-search`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${BASE_URL}/visualizer/bfs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/visualizer/dfs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/visualizer/bst`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/visualizer/tree-traversals`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/visualizer/linked-list`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/visualizer/stack`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${BASE_URL}/visualizer/queue`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },

        // Community & tools
        { url: `${BASE_URL}/community`, lastModified: now, changeFrequency: 'daily', priority: 0.65 },
        { url: `${BASE_URL}/think`, lastModified: now, changeFrequency: 'weekly', priority: 0.55 },
        { url: `${BASE_URL}/coding-stats`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },

        // Info pages
        { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/feedback`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    ]

    // All 15 pattern pages — high individual SEO value
    const patternPages: MetadataRoute.Sitemap = PATTERN_SLUGS.map((slug) => ({
        url: `${BASE_URL}/patterns/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    return [...staticPages, ...patternPages]
}
