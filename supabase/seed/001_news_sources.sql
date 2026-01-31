-- =============================================
-- iMoD Team — Seed: Default News Sources
-- =============================================

INSERT INTO news_sources (name, url, feed_type, category) VALUES
  -- Apple & iOS
  ('9to5Mac', 'https://9to5mac.com/feed/', 'rss', 'apple'),
  ('MacRumors', 'https://feeds.macrumors.com/MacRumors-All', 'rss', 'apple'),
  ('AppleInsider', 'https://appleinsider.com/rss/news/', 'rss', 'apple'),

  -- EV & Clean Energy
  ('Electrek', 'https://electrek.co/feed/', 'rss', 'ev'),
  ('InsideEVs', 'https://insideevs.com/rss/news/all/', 'rss', 'ev'),
  ('CarNewsChina', 'https://carnewschina.com/feed/', 'rss', 'ev'),
  ('CleanTechnica', 'https://cleantechnica.com/feed/', 'rss', 'ev'),

  -- Tech
  ('The Verge', 'https://www.theverge.com/rss/index.xml', 'rss', 'tech'),
  ('TechCrunch', 'https://techcrunch.com/feed/', 'rss', 'tech'),
  ('Ars Technica', 'https://feeds.arstechnica.com/arstechnica/index', 'rss', 'tech'),

  -- Economy
  ('Reuters Tech', 'https://www.reuters.com/technology/rss', 'rss', 'economy'),

  -- Gadgets
  ('GSMArena', 'https://www.gsmarena.com/rss-news-reviews.php3', 'rss', 'gadgets');
