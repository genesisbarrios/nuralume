import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import { getBlogPost } from "@/libs/blogPosts";

const post = getBlogPost("what-are-brain-waves-and-how-music-affects-the-brain")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  keywords: [
    "brain waves",
    "how music affects the brain",
    "binaural beats",
    "solfeggio frequencies",
    "brainwave entrainment",
  ],
  openGraph: {
    title: post.title,
    description: post.excerpt,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.excerpt,
  },
  alternates: { canonical: `/blog/${post.slug}` },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        Your brain is never silent. Billions of neurons firing in
        coordination produce faint electrical rhythms that can be measured on
        the scalp with an EEG — and depending on how fast those rhythms
        oscillate, they&apos;re grouped into five bands, each associated with
        a different mental state. Understanding them is the key to
        understanding why the right piece of music can help you focus, wind
        down, or fall asleep.
      </p>

      <h2>The five brain wave bands</h2>
      <ul>
        <li>
          <strong>Delta (0.5–4 Hz).</strong> The slowest waves, dominant
          during deep, dreamless sleep. Associated with physical restoration
          and the body&apos;s repair processes.
        </li>
        <li>
          <strong>Theta (4–8 Hz).</strong> Common during light sleep, deep
          meditation, and the drowsy state right before you drift off.
          Linked to creativity, intuition, and vivid imagery.
        </li>
        <li>
          <strong>Alpha (8–12 Hz).</strong> The signature of a relaxed but
          alert mind — eyes closed, calm, not actively problem-solving. Often
          described as the bridge between conscious thought and deeper
          relaxation.
        </li>
        <li>
          <strong>Beta (12–30 Hz).</strong> The default state of ordinary
          waking life: alert, engaged, actively thinking. Useful for focus
          and productivity, but sustained high beta activity is also linked
          to stress and anxiety.
        </li>
        <li>
          <strong>Gamma (30–100 Hz).</strong> The fastest, least understood
          band, associated with peak concentration, memory recall, and
          moments of insight.
        </li>
      </ul>

      <h2>How music actually affects the brain</h2>
      <p>
        Music doesn&apos;t just play in the background — it changes brain
        activity in measurable ways. Tempo, rhythm, and repetition can pull
        brainwave activity toward matching frequencies, a phenomenon broadly
        known as <strong>entrainment</strong>. A slow, steady, low-frequency
        track tends to nudge the brain toward calmer alpha or theta states;
        an upbeat, complex track tends to keep it in beta. Music also
        triggers dopamine release in the brain&apos;s reward pathways, which
        is part of why the right track can shift mood almost immediately,
        not just gradually over a listening session.
      </p>
      <p>
        This is the idea behind most &ldquo;focus,&rdquo; &ldquo;sleep,&rdquo;
        and &ldquo;calm&rdquo; music: it&apos;s not just pleasant sound,
        it&apos;s sound engineered around the brainwave state you&apos;re
        trying to reach.
      </p>

      <h3>Binaural beats</h3>
      <p>
        Binaural beats are a specific technique for encouraging entrainment.
        Play a slightly different tone in each ear — say, 200 Hz in the left
        and 210 Hz in the right — and the brain perceives a third, phantom
        beat at the difference between the two: 10 Hz, squarely in the alpha
        range. The theory is that the brain&apos;s auditory processing
        &ldquo;syncs&rdquo; to that phantom frequency, nudging overall brain
        activity toward it. Binaural beats only work over headphones, since
        each ear needs to receive a distinct tone — through speakers, the
        two tones just blend together in the air before they reach you.
      </p>
      <p>
        It&apos;s worth being honest about the evidence here: some studies
        show modest effects on relaxation, focus, or anxiety, while others
        find no measurable difference from a placebo track. Binaural beats
        aren&apos;t a guaranteed shortcut to a given mental state, but for
        many people they&apos;re a genuinely useful, low-effort tool worth
        trying — especially paired with something you&apos;re already doing,
        like studying, meditating, or winding down for sleep.
      </p>

      <h3>Solfeggio frequencies</h3>
      <p>
        Solfeggio frequencies are a different, older tradition: a set of six
        (sometimes nine) specific tones — 396, 417, 528, 639, 741, and 852 Hz
        are the most commonly cited — said to trace back to ancient chants
        and each associated with a particular effect, from grounding and
        stress relief to focus and intuition. 528 Hz in particular has
        picked up a reputation as the &ldquo;love frequency,&rdquo; often
        linked to healing and DNA repair claims that go well beyond what
        research actually supports.
      </p>
      <p>
        Unlike binaural beats, Solfeggio tones aren&apos;t built on a
        specific neuroscience mechanism — there&apos;s no direct evidence
        that a single tone at 528 Hz does something a similarly pleasant tone
        at 520 Hz wouldn&apos;t. What does hold up is the more general
        finding that calm, resonant, sustained tones can support relaxation
        the same way ambient music or nature sounds do. Treat the specific
        numbers as a framework worth exploring rather than a proven
        mechanism, and judge each track by how it actually makes you feel.
      </p>

      <h2>Putting it into practice</h2>
      <p>
        You don&apos;t need to memorize frequency ranges to benefit from any
        of this. In practice, it comes down to matching the music to the
        state you want: slower, sparser, lower tracks for winding down or
        meditating; more rhythmic, engaged tracks for focus. Binaural beats
        and Solfeggio tones are both worth experimenting with as part of
        that toolkit — headphones on, one track at a time, paying attention
        to what actually shifts how you feel.
      </p>
    </BlogPostLayout>
  );
}
