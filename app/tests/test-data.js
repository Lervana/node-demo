export const exampleInput = [
  {
    url: 'https://twitter.com/aaa',
    entityType: 'person',
    linksTo: ['https://twitter.com/bbb', 'https://linkedin.com/aaa'],
  },
  {
    url: 'https://linkedin.com/aaa',
    entityType: 'person',
    linksTo: ['http://aaa.com'],
  },
  {
    url: 'https://bbb.com',
    entityType: 'uncategorized',
    linksTo: [],
  },
  {
    url: 'https://example.com',
    entityType: 'organization',
    linksTo: ['https://www.twitter.com/aaa'],
  },
  {
    url: 'http://aaa.com',
    entityType: 'person',
    linksTo: ['http://twitter.com/aaa'],
  },
  {
    url: 'https://www.twitter.com/ccc',
    entityType: 'person',
    linksTo: ['https://example2.com'],
  },
  {
    url: 'https://www.example2.com',
    entityType: 'person',
    linksTo: ['https://twitter.com/ccc'],
  },
];

export const exampleOutput = [
  [
    {
      url: 'http://twitter.com/aaa',
      entityType: 'person',
      linksTo: ['http://twitter.com/bbb', 'http://linkedin.com/aaa'],
    },
    { url: 'http://linkedin.com/aaa', entityType: 'person', linksTo: ['http://aaa.com'] },
  ],
  [{ url: 'http://example.com', entityType: 'organization', linksTo: ['http://twitter.com/aaa'] }],
  [{ url: 'http://aaa.com', entityType: 'person', linksTo: ['http://twitter.com/aaa'] }],
  [
    { url: 'http://twitter.com/ccc', entityType: 'person', linksTo: ['http://example2.com'] },
    { url: 'http://example2.com', entityType: 'person', linksTo: ['http://twitter.com/ccc'] },
  ],
];
