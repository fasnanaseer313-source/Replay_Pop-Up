import sys

content = open('index.html', 'r', encoding='utf-8').read()

target = '''          <details class="faq-det"><summary>How much space do you need?</summary><p>RePlay setups work in compact spaces too — terraces, living rooms, office corners, lawns, clubhouses, and more. Share your space with us and we'll suggest what fits best.</p></details>
          <details class="faq-det"><summary>How long does setup take?</summary><p>Most RePlay setups are ready in around 30 minutes.</p></details>
          <details class="faq-det"><summary>Is this only for kids?</summary><p>Not even close. Kids start fast, but adults usually end up staying longer.</p></details>
          
          <button id="faq-toggle-btn" class="btn-primary mt-3">Learn More</button>
          <div id="faq-list-container" style="display: none; margin-top: 20px;">
            <details class="faq-det"><summary>Do you only do racing?</summary><p>Not at all. RePlay is built around obstacle courses, crawler challenges, interactive games, and hands-on RC experiences. Racing is just one format.</p></details>
            <details class="faq-det"><summary>Can this work indoors?</summary><p>Yes. We do both indoor and outdoor setups depending on the space and experience format.</p></details>
            <details class="faq-det"><summary>Do we need to arrange any equipment?</summary><p>Nope. We bring everything needed for the RePlay setup.</p></details>
            <details class="faq-det"><summary>Is someone there to manage the experience?</summary><p>Yes. Every setup includes RePlay hosts who handle setup, gameplay flow, and coordination throughout the session.</p></details>
            <details class="faq-det"><summary>Can you do corporate or brand events?</summary><p>Yes — from team days and office breaks to launches, activations, and community events.</p></details>
            <details class="faq-det"><summary>How much does it cost?</summary><p>RePlay experiences start from ₹4,999. Pricing depends on the setup, duration, crowd size, and experience format. Corporate and bulk event pricing available — message us for a custom quote.</p></details>
            <details class="faq-det"><summary>How do we book?</summary><p>Just message us on WhatsApp — your space, date, and how many people. We'll suggest the right setup and share a quote. Usually takes minutes.</p></details>
            <details class="faq-det"><summary>Do you come to the venue or do we come to you?</summary><p>We come to you — fully equipped. You don't need to arrange anything. Just tell us the address and we come and set up.</p></details>
          </div>'''

replacement = '''          <details class="faq-det"><summary>How much space do I actually need?</summary><p>Honestly, not much. A small spot is enough to start with — dining table, balcony corner, a bit of living room floor. Whatever you've got, we'll make it work.</p></details>
          <details class="faq-det"><summary>Set up in a living room before?</summary><p>All the time — living room, balcony, wherever suits you. No rearranging, no prep on your end. We just need a little space and we'll take it from there.</p></details>
          <details class="faq-det"><summary>How long does setup take?</summary><p>15 to 30 minutes, start to finish. Our crew handles it quietly while you carry on getting ready.</p></details>
          
          <button id="faq-toggle-btn" class="btn-primary mt-3">Learn More</button>
          <div id="faq-list-container" style="display: none; margin-top: 20px;">
            <details class="faq-det"><summary>Only certain areas of Bangalore?</summary><p>Nope — we cover all of Bangalore and nearby areas. Just tell us where you are, and we'll sort the rest.</p></details>
            <details class="faq-det"><summary>Is RePlay meant for all age groups, or just kids?</summary><p>All ages, genuinely. We've watched office teams forget their "quick break" was supposed to be quick, and parents elbow their kids out for a turn.</p></details>
            <details class="faq-det"><summary>Anything we need to manage, or does RePlay take care of it all?</summary><p>All of it's on us — crawlers, course, obstacles, setup, cleanup. You don't lift a finger, just enjoy.</p></details>
            <details class="faq-det"><summary>How do we book?</summary><p>A quick message on WhatsApp with your space, date, and rough headcount is all it takes. We'll suggest what fits and get back to you in minutes.</p></details>
            <details class="faq-det"><summary>Can we customize the setup based on our requirements?</summary><p>Of course. Tell us what you're picturing and we'll shape the experience around it — not the other way round.</p></details>
            <details class="faq-det"><summary>How far in advance should we book?</summary><p>As early as you can — weekends fill fast. For weekday or smaller bookings, even a few days' notice usually works, but it's best to check availability early.</p></details>
            <details class="faq-det"><summary>What if we need to cancel or reschedule?</summary><p>Rescheduling is free — just let us know as early as possible.<br><br>For cancellations, 50% of the booking amount will be retained, as we reserve the slot specifically for your event.<br><br>Message us on WhatsApp and we'll help work out the best option.</p></details>
            <details class="faq-det"><summary>What happens if it rains or the weather doesn't cooperate?</summary><p>For outdoor setups, we'll coordinate with you ahead of time. If needed, we can usually shift the experience indoors or reschedule — just keep us posted on conditions.</p></details>
            <details class="faq-det"><summary>Is there a minimum or maximum group size?</summary><p>No strict minimum — even a small family gathering works. For larger groups, we just run it as a rotation so everyone gets time on the controller.</p></details>
          </div>'''

if target not in content:
    print('Target not found in content!')
    sys.exit(1)

content = content.replace(target, replacement)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
