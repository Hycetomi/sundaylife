-- Blog Posts & Event Registrations
-- Migration 007

CREATE TABLE blog_posts (
  id                UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  title             TEXT         NOT NULL,
  slug              TEXT         UNIQUE NOT NULL,
  excerpt           TEXT,
  body              TEXT,
  category          TEXT         NOT NULL CHECK (category IN ('Update','Devotion','Story','Events','Culture')),
  author_name       TEXT         NOT NULL DEFAULT 'SundayLife',
  cover_image_url   TEXT,
  video_url         TEXT,
  video_type        TEXT         CHECK (video_type IN ('youtube','upload')),
  is_featured       BOOLEAN      NOT NULL DEFAULT FALSE,
  event_date        DATE,
  registration_open BOOLEAN      NOT NULL DEFAULT FALSE,
  capacity          INT,
  published_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE event_registrations (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     UUID         NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  full_name   TEXT         NOT NULL,
  email       TEXT         NOT NULL,
  phone       TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, email)
);

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_posts"  ON blog_posts FOR SELECT USING (true);
CREATE POLICY "admin_manage_posts" ON blog_posts FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'));

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_register"   ON event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read_regs"   ON event_registrations FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'));

-- ── Seed: 5 starter posts (converted from homepage preview) ──────────────────

INSERT INTO blog_posts
  (title, slug, excerpt, body, category, author_name, is_featured, event_date, registration_open, capacity, published_at)
VALUES
  (
    'Summer Camp ''26 Registrations Open',
    'summer-camp-26-registrations-open',
    'Registration is live for our biggest youth gathering of the year. Secure your spot before spaces fill.',
    E'Every year SundayLife pulls together some of the most vibrant, faith-filled young people from across our communities for a week that changes lives.\n\nSummer Camp ''26 is happening this August, and we''re expecting over 400 attendees from cities across the region. From sunrise devotionals to late-night worship sessions, from outdoor adventures to breakout workshops led by some of our favourite voices — this is the full experience.\n\nWe''re opening registrations now to give families time to plan. Spaces are genuinely limited — we cap attendance to keep the community feel intact.\n\nWhat to expect:\n\n- 5 full days and 4 nights in our camp grounds\n- Daily worship sessions and teaching from guest speakers\n- Team-building activities and sports tournaments\n- Evening bonfires and acoustic worship\n- Dedicated time for small group connection\n\nRegistration covers accommodation, all meals, and programme materials. Early bird pricing is available until June 30. Fill out the form below to secure your place.',
    'Update',
    'SundayLife Events Team',
    TRUE,
    '2026-08-10',
    TRUE,
    400,
    NOW() - INTERVAL '4 days'
  ),
  (
    'Finding Peace in Chaos',
    'finding-peace-in-chaos',
    'In a world that never slows down, where do we find stillness? A reflection on Psalm 46 and what it means to rest in God''s presence.',
    E'There is a verse that has followed me around for years. Psalm 46:10 — "Be still, and know that I am God." It sounds simple. It is anything but.\n\nWe live in an age of constant input. Notifications, timelines, group chats, news cycles that never end. The world has engineered itself to keep us perpetually stimulated, and in that stimulation, something deep inside us is slowly eroded: the ability to be still.\n\nBut stillness is not passivity. In the original Hebrew, the word translated "be still" (raphah) carries the sense of releasing — of letting go of the striving. It is an active surrender, not a passive absence.\n\nWhat does that look like in practice?\n\nFor me it has meant learning to treat silence as a discipline rather than an absence. It has meant being deliberate about creating space — small pockets of intentional quiet — before the day builds its momentum and pulls me into its current.\n\nA morning without screens. A walk without a podcast. A meal eaten slowly, without a task to get back to.\n\nThese are not dramatic acts. But over time, they accumulate into something that looks remarkably like peace.\n\nThe chaos does not go away. That is not the promise. The promise is a presence within the chaos that is steadfast, unshaken, and completely sufficient for whatever you are walking through today.',
    'Devotion',
    'Pastor James Osei',
    FALSE,
    NULL,
    FALSE,
    NULL,
    NOW() - INTERVAL '9 days'
  ),
  (
    'Why We Worship Loud',
    'why-we-worship-loud',
    'There''s a reason our Sunday sessions feel more like a concert than a church service — and it''s entirely intentional.',
    E'People ask us about the volume. Sometimes they say it respectfully. Occasionally they don''t. Why is it so loud? Is that really necessary?\n\nHere''s our honest answer: yes. And here''s why.\n\nWorship has always been a full-body act. In the Psalms, we see people singing, shouting, dancing, clapping, playing instruments with abandon. Worship in scripture is rarely described as a quiet, contained experience. It is expansive. It is expressive. It is communal in the most physical sense — people making sound together, sound that fills space and announces something to the atmosphere around them.\n\nThere is something that happens when a room full of people sings at full voice. The self-consciousness that isolates us begins to dissolve. You stop being aware of your own voice and start being aware of the collective sound you are part of. That dissolution is not a loss — it is a gift. It is what it feels like to be genuinely connected to something larger than yourself.\n\nWe worship loud because quiet can sometimes mean guarded. And we do not want guarded worship. We want the kind that costs something — the kind where you give it everything and walk out feeling like you left something in the room.\n\nThat''s the culture we''re building. Come and add your voice to it.',
    'Culture',
    'Worship Team',
    FALSE,
    NULL,
    FALSE,
    NULL,
    NOW() - INTERVAL '15 days'
  ),
  (
    'Sarah''s Journey to Faith',
    'sarahs-journey-to-faith',
    'Sarah walked into a Lifehouse gathering on a Tuesday evening, not knowing anyone. Eight months later, she is leading one of her own.',
    E'Sarah did not grow up in church. Her background was secular in the most ordinary sense — faith was not hostile in her household, just absent. Something to do with other people.\n\nShe came to her first Lifehouse gathering because her colleague would not stop inviting her. After the third or fourth invitation, she ran out of excuses.\n\n"I expected it to feel like a performance," she told us. "Like people putting on a version of themselves for God. But it wasn''t that at all. People were just... honest. About their week, their struggles, what they were hoping for. I didn''t expect that."\n\nShe came back the next week. And the week after that.\n\nOver the following months, something shifted. The questions she had carried loosely — questions about purpose, about meaning, about whether there was anything underneath the surface of ordinary life — began to feel urgent. She started bringing them into the conversations happening in the living room every Tuesday.\n\n"Nobody gave me easy answers," she says. "They just sat with me in the questions. That''s what changed things for me."\n\nSarah gave her life to Christ six months after walking through the door. Last month, she started facilitating her own Lifehouse group — eleven people gathered around a table every other Thursday, many of them where she was a year ago.\n\n"I just want to give people what was given to me," she says. "A place where the questions are welcome."',
    'Story',
    'SundayLife Stories',
    FALSE,
    NULL,
    FALSE,
    NULL,
    NOW() - INTERVAL '21 days'
  ),
  (
    'Night of Worship: March',
    'night-of-worship-march',
    'An evening of extended worship, open to everyone. Come as you are — leave changed.',
    E'Night of Worship is one of the most anticipated gatherings on our calendar.\n\nThere is no programme, no schedule, no speaker. Just music, presence, and people who have chosen to carve out an evening to seek God together.\n\nOur worship team will lead from the front, but this is not a concert — it is a congregation. Every voice matters. Whether you have been singing your whole life or you have never worshipped openly before, there is a place for you in the room.\n\nExpect:\n\n- Two to three hours of uninterrupted worship\n- Moments of corporate prayer and declaration\n- Space to respond however you need to\n- A community that welcomes every background\n\nDoors open at 6:30 PM. The gathering begins at 7:00 PM. There is no dress code and no ticket required. Bring a friend.\n\nWe look forward to standing in the room with you.',
    'Events',
    'SundayLife Events Team',
    FALSE,
    '2026-06-20',
    FALSE,
    NULL,
    NOW() - INTERVAL '28 days'
  );
