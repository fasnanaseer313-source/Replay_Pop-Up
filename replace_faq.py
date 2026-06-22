import sys

content = open('index.html', 'r', encoding='utf-8').read()

start_marker = '<div class="faq-accordion mt-5">'
end_marker = '</div>\n      </div>\n    </section>\n\n    <!-- 12. FOOTER -->'

new_faq = '''<div class="faq-accordion mt-5">
          <div class="eyebrow" style="margin-bottom: 15px;">FAQ</div>
          <h3 class="mb-3 text-white">Questions we get a lot</h3>
          
          <details class="faq-det"><summary>How much space do I actually need?</summary><p>Honestly, not much. A small spot is enough to start with &mdash; dining table, balcony corner, a bit of living room floor. Whatever you've got, we'll make it work.</p></details>
          <details class="faq-det"><summary>Set up in a living room before?</summary><p>All the time &mdash; living room, balcony, wherever suits you. No rearranging, no prep on your end. We just need a little space and we'll take it from there.</p></details>
          <details class="faq-det"><summary>How long does setup take?</summary><p>15 to 30 minutes, start to finish. Our crew handles it quietly while you carry on getting ready.</p></details>
          <details class="faq-det"><summary>Only certain areas of Bangalore?</summary><p>Nope &mdash; we cover all of Bangalore and nearby areas. Just tell us where you are, and we'll sort the rest.</p></details>
          
          <button id="faq-toggle-btn" class="btn-primary mt-3">Learn More</button>
          <div id="faq-list-container" style="display: none; margin-top: 20px;">
            <details class="faq-det"><summary>Is RePlay meant for all age groups, or just kids?</summary><p>All ages, genuinely. We've watched office teams forget their "quick break" was supposed to be quick, and parents elbow their kids out for a turn.</p></details>
            <details class="faq-det"><summary>Anything we need to manage, or does RePlay take care of it all?</summary><p>All of it's on us &mdash; crawlers, course, obstacles, setup, cleanup. You don't lift a finger, just enjoy.</p></details>
            <details class="faq-det"><summary>How do we book?</summary><p>A quick message on WhatsApp with your space, date, and rough headcount is all it takes. We'll suggest what fits and get back to you in minutes.</p></details>
            <details class="faq-det"><summary>Can we customize the setup based on our requirements?</summary><p>Of course. Tell us what you're picturing and we'll shape the experience around it &mdash; not the other way round.</p></details>
            <details class="faq-det"><summary>How far in advance should we book?</summary><p>As early as you can &mdash; weekends fill fast. For weekday or smaller bookings, even a few days' notice usually works, but it's best to check availability early.</p></details>
            <details class="faq-det"><summary>What if we need to cancel or reschedule?</summary><p>Rescheduling is free &mdash; just let us know as early as possible.<br><br>For cancellations, 50% of the booking amount will be retained, as we reserve the slot specifically for your event.<br><br>Message us on WhatsApp and we'll help work out the best option.</p></details>
            <details class="faq-det"><summary>What happens if it rains or the weather doesn't cooperate?</summary><p>For outdoor setups, we'll coordinate with you ahead of time. If needed, we can usually shift the experience indoors or reschedule &mdash; just keep us posted on conditions.</p></details>
            <details class="faq-det"><summary>Is there a minimum or maximum group size?</summary><p>No strict minimum &mdash; even a small family gathering works. For larger groups, we just run it as a rotation so everyone gets time on the controller.</p></details>
          </div>
        </div>'''

idx_start = content.find(start_marker)
idx_end = content.find('<!-- 12. FOOTER -->')

if idx_start != -1 and idx_end != -1:
    # Find the closing tag of the section before footer
    idx_end = content.rfind('</section>', 0, idx_end)
    if idx_end != -1:
        # We replace from idx_start to the end of faq-accordion div.
        # But we don't know exactly where faq-accordion ends without a parser.
        # Let's just find `</div>\n      </div>\n    </section>` or similar.
        
        # Better strategy: use regex or substring replacement of the known content.
        old_content_approx = content[idx_start:idx_end]
        # Just replace everything from `<div class="faq-accordion mt-5">` to the end of that div.
        
        # We can find `</div>\n        </div>\n      </div>\n    </section>`
        end_accordion = content.find('</div>\n      </div>\n    </section>', idx_start)
        if end_accordion != -1:
            new_content = content[:idx_start] + new_faq + '\n' + content[end_accordion:]
            with open('index.html', 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Successfully updated FAQs")
        else:
            print("Could not find the end of the accordion block")
else:
    print("Could not find markers")
