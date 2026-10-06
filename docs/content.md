# Writing for Postcard

The words should sound the way the design looks: warm, plain and a little playful, never at the expense of being clear. Write
like a friend telling you about their trip, and like a good sign telling you where to go.

## Voice

- **Friendly and plain.** "Follow the trip by email?", not "Subscribe to our newsletter for updates."
- **Specific.** "142 miles, 6 hours in the saddle", not "A long day."
- **Short.** One idea per sentence. Cut words that don't change the meaning.
- **Playful in the content, not the controls.** A story can say "The Dales do a very particular green after rain." A button
  says "Subscribe".
- **British English.** Colour, kilometres, programme, "9 Sept".

## Naming things

Call things what people call them, not how the system is built.

| Write | Not |
| --- | --- |
| Day 7, the blog, the globe, the map | Event 7, posts feed, 3D view |
| Photos | Media, assets |
| Your email address | Email field, user email |
| Notifications, emails | Webhooks, subscriptions |

Use **sentence case** everywhere: titles, buttons, labels and menus. "Show all days", not "Show All Days".

## Buttons and links

- Start with a verb that says what happens: "Subscribe", "Ride from day 1", "Show all sections", "Delete photo".
- Say the same thing afterwards: the button "Subscribe" leads to the confirmation "Subscribed".
- Link text makes sense on its own: "Read the day 7 story", not "Click here" or "Read more". If the design needs a short
  "Change" link, add hidden text: `Change<span class="pc-sr-only"> riding time</span>`.
- One primary button per view, so there's one obvious next step.

## Errors

Say what went wrong and how to fix it. Don't apologise, blame or get technical.

| Write | Not |
| --- | --- |
| Enter an email address, like name@example.com | Invalid input |
| That postcode is too short. It looks like LL55 4UR. | Error: validation failed |
| That photo didn't upload. It's over 20 MB. Resize it and try again. | Oops! Something went wrong 😢 |
| The map didn't load. Check your connection and refresh the page. | Network error 503 |

Use the same words in the error summary and under the field.

## Confirmations, toasts and empty states

- **Confirmations** say what happened and what happens next: "You're subscribed. We've sent a link to you@example.com.
  Click it to confirm, and the next story will come to you."
- **Toasts** are a few words in the past tense: "Photo deleted", "Link copied". If there's an undo, offer it: "Undo".
- **Empty states** say what will be here and how to start: "No stories yet. Stories you write from the road show up here, in
  the order you rode them." Then a button: "Write the first one".

## Numbers, dates and times

- Numerals for all numbers, with commas from 1,000: "18 days", "2,448 miles", "459 photos".
- Units in words after the number, with a space: "142 miles", "20 MB", "9 to 16°C". Times of travel: "6 h 05".
- Dates: "Wed 9 Sept" in lists and cards, "Wednesday 9 September 2026" in full sentences. No "th" or "st".
- Times: the 24-hour clock with a colon, "11:42". "Midday" and "midnight", not "12:00".
- Ranges with "to": "9 to 16°C", "day 3 to day 5". Use an en dash (–) only in tables, where space is tight.

## Alt text and captions

- Alt text says what the photo shows, for someone who can't see it: "The lake at Ullswater below steep green hills."
- Don't start with "Image of" or "Photo of".
- If the caption already says it all, the alt can be empty (`alt=""`); don't repeat it.
- Captions add what the photo can't: where, when, why it matters. "Buttertubs Pass, 11:42 on day 7."

## Accessibility in words

- Every field has a visible label. Use placeholders only for examples, never instead of a label.
- Hints go above the field, before people start typing.
- Don't rely on colour or position: "the sage tag" or "the button on the right" means nothing to some readers.
- Icon-only buttons need an `aria-label` that says what they do: "Close", "Next photo".
