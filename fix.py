import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Top marquee
top_marquee_old = '''    <div class="marquee-wrap">
      <div class="marquee-track mq-right">
        <span><span class="orange">—</span> Even the CEO grabbed the controller</span>
        <span><span class="orange">—</span> Our terrace turned into a stadium</span>
        <span><span class="orange">—</span> Kids didn't leave. Adults refused to.</span>
        <span><span class="orange">—</span> Didn't expect adults to get this competitive</span>
        <span><span class="orange">—</span> Even the CEO grabbed the controller</span>
        <span><span class="orange">—</span> Our terrace turned into a stadium</span>
      </div>
      <div class="marquee-track mq-left">
        <span><span class="orange">—</span> We literally rearranged the living room for this</span>
        <span><span class="orange">—</span> The one thing everyone did at the reunion</span>
        <span><span class="orange">—</span> Best Sunday in months, honestly</span>
        <span><span class="orange">—</span> One more round became six more rounds</span>
        <span><span class="orange">—</span> We literally rearranged the living room for this</span>
        <span><span class="orange">—</span> The one thing everyone did at the reunion</span>
      </div>
    </div>'''

top_marquee_new = '''    <div class="marquee-wrap" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 1.3rem; letter-spacing: 0.5px; border: none; padding: 15px 0; background: transparent;">
      <div class="marquee-track mq-right">
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Even the CEO grabbed the controller</span>
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Our terrace turned into a stadium</span>
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Kids didn't leave. Adults refused to.</span>
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Didn't expect adults to get this competitive</span>
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Even the CEO grabbed the controller</span>
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Our terrace turned into a stadium</span>
      </div>
      <div class="marquee-track mq-left">
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> We literally rearranged the living room for this</span>
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> The one thing everyone did at the reunion</span>
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Best Sunday in months, honestly</span>
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> One more round became six more rounds</span>
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> We literally rearranged the living room for this</span>
        <span><span class="orange" style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> The one thing everyone did at the reunion</span>
      </div>
    </div>'''

content = content.replace(top_marquee_old, top_marquee_new)

# 2. Mid marquee
mid_marquee_old = '''        <div class="marquee-wrap gs-reveal" style="padding: 10px 0; border: none; background: #000; margin-bottom: 40px; margin-top: -10px;">
          <div class="marquee-track mq-right" style="color: var(--orange);">
            <span>Crawl <span style="font-size: 0.8em; margin: 0 15px;">—</span> Climb <span style="font-size: 0.8em; margin: 0 15px;">—</span> Play <span style="font-size: 0.8em; margin: 0 15px;">—</span> RePlay</span>
            <span><span style="font-size: 0.8em; margin: 0 15px;">—</span> Crawl <span style="font-size: 0.8em; margin: 0 15px;">—</span> Climb <span style="font-size: 0.8em; margin: 0 15px;">—</span> Play <span style="font-size: 0.8em; margin: 0 15px;">—</span> RePlay</span>
            <span><span style="font-size: 0.8em; margin: 0 15px;">—</span> Crawl <span style="font-size: 0.8em; margin: 0 15px;">—</span> Climb <span style="font-size: 0.8em; margin: 0 15px;">—</span> Play <span style="font-size: 0.8em; margin: 0 15px;">—</span> RePlay</span>
            <span><span style="font-size: 0.8em; margin: 0 15px;">—</span> Crawl <span style="font-size: 0.8em; margin: 0 15px;">—</span> Climb <span style="font-size: 0.8em; margin: 0 15px;">—</span> Play <span style="font-size: 0.8em; margin: 0 15px;">—</span> RePlay</span>
          </div>
        </div>'''

mid_marquee_new = '''        <div class="marquee-wrap gs-reveal" style="padding: 10px 0; border: none; background: #000; margin-bottom: 40px; margin-top: -10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 700; font-size: 1.8rem; letter-spacing: 0.5px;">
          <div class="marquee-track mq-right" style="color: var(--orange);">
            <span>RePlay <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Crawl <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Climb <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Play <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span></span>
            <span>RePlay <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Crawl <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Climb <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Play <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span></span>
            <span>RePlay <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Crawl <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Climb <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Play <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span></span>
            <span>RePlay <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Crawl <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Climb <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Play <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span></span>
            <span>RePlay <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Crawl <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Climb <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Play <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span></span>
            <span>RePlay <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Crawl <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Climb <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span> Play <span style="font-size: 0.7em; margin: 0 30px; position: relative; top: -3px;">?</span></span>
          </div>
        </div>'''

content = content.replace(mid_marquee_old, mid_marquee_new)

# 3. Footer modifications
content = content.replace('<h2 class="footer-title">Three columns. Clean and functional.</h2>', '')
content = content.replace('''        <div class="footer-cta-wrap gs-footer-bottom">
          <a href="https://wa.me/919987412025" class="footer-wa-btn" target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>
        </div>''', '')

# 4. Orange italic RePlay
content = content.replace('''<h2 class="booking-title">Let's bring RePlay to your space.</h2>''', '''<h2 class="booking-title">Let's bring <span class="orange serif-italic" style="text-transform: none;">RePlay</span> to your space.</h2>''')

# 5. Wall Section replace with new Testimonial section
wall_old = '''        <!-- Testimonials List -->
        <div class="ed-testimonials-list">
          
          <div class="ed-testimonial gs-reveal">
            <h4 class="ed-test-title">Testimonial 01 &mdash; Corporate</h4>
            <div class="ed-tags">
              <span class="ed-tag">Corporate offsite</span><span style="color: rgba(0,0,0,0.3)">&middot;</span><span class="ed-tag">120 guests</span><span style="color: rgba(0,0,0,0.3)">&middot;</span><span class="ed-tag">Bellandur</span>
            </div>
            <div class="ed-quote-box">
              <div class="ed-quote-line"></div>
              <p class="ed-quote">"We planned it as a small break activity. Half the office came down and participated."</p>
              <p class="ed-author">&mdash; Rohan K., HR Manager</p>
            </div>
          </div>

          <div class="ed-testimonial gs-reveal">
            <h4 class="ed-test-title">Testimonial 02 &mdash; Birthday</h4>
            <div class="ed-tags">
              <span class="ed-tag">Birthday party</span><span style="color: rgba(0,0,0,0.3)">&middot;</span><span class="ed-tag">Bangalore</span>
            </div>
            <div class="ed-quote-box">
              <div class="ed-quote-line"></div>
              <p class="ed-quote">"My son has not stopped talking about this since the party."</p>
              <p class="ed-author">&mdash; Priya M.</p>
            </div>
          </div>

          <div class="ed-testimonial gs-reveal">
            <h4 class="ed-test-title">Testimonial 03 &mdash; House party</h4>
            <div class="ed-tags">
              <span class="ed-tag">Anniversary setup</span><span style="color: rgba(0,0,0,0.3)">&middot;</span><span class="ed-tag">House party</span>
            </div>
            <div class="ed-quote-box">
              <div class="ed-quote-line"></div>
              <p class="ed-quote">"We thought the kids would play. The adults took over."</p>
              <p class="ed-author">&mdash; Anjali &amp; Vikram</p>
            </div>
          </div>

          <div class="ed-testimonial gs-reveal">
            <h4 class="ed-test-title">Testimonial 04 &mdash; School</h4>
            <div class="ed-tags">
              <span class="ed-tag">School fest</span><span style="color: rgba(0,0,0,0.3)">&middot;</span><span class="ed-tag">300+ students</span>
            </div>
            <div class="ed-quote-box">
              <div class="ed-quote-line"></div>
              <p class="ed-quote">"Setup was done before our opening ceremony. Students were already in a queue before we even announced it."</p>
              <p class="ed-author">&mdash; Ms. Divya R., Event Coordinator</p>
            </div>
          </div>

        </div>'''

wall_new = '''        <!-- Testimonials List -->
        <div class="ed-testimonials-list">
          
          <div class="ed-testimonial gs-reveal">
            <h4 class="ed-test-title">Testimonial 01 &mdash; Corporate</h4>
            <div class="ed-tags">
              <span class="ed-tag">Corporate offsite</span><span style="color: rgba(0,0,0,0.3)">&middot;</span><span class="ed-tag">120 guests</span><span style="color: rgba(0,0,0,0.3)">&middot;</span><span class="ed-tag">Bellandur</span>
            </div>
            <div class="ed-quote-box">
              <div class="ed-quote-line"></div>
              <p class="ed-quote">"We planned it as a small break activity. Half the office came down and participated."</p>
              <p class="ed-author">&mdash; Rohan K., HR Manager</p>
            </div>
          </div>

          <!-- Corporate Event Gallery -->
          <div class="event-gallery corporate-gallery">
            <div class="eg-card eg-hero gs-gallery-card">
              <img src="./assets/Images/Images/group_interaction.png" class="eg-img" alt="Corporate Event" />
            </div>
            <div class="eg-card eg-square gs-gallery-card">
              <img src="./assets/Images/Images/poster_corporate_1775801452704.png" class="eg-img" alt="Corporate Event" />
            </div>
            <div class="eg-card eg-portrait gs-gallery-card">
              <img src="./assets/Images/Images/racing_action.png" class="eg-img" alt="Corporate Event" />
            </div>
            <div class="eg-card eg-landscape gs-gallery-card">
              <img src="./assets/Images/Images/poster_generic2_1775801940934.png" class="eg-img" alt="Corporate Event" />
            </div>
          </div>

          <div class="ed-testimonial gs-reveal">
            <h4 class="ed-test-title">Testimonial 02 &mdash; Birthday</h4>
            <div class="ed-tags">
              <span class="ed-tag">Birthday party</span><span style="color: rgba(0,0,0,0.3)">&middot;</span><span class="ed-tag">Bangalore</span>
            </div>
            <div class="ed-quote-box">
              <div class="ed-quote-line"></div>
              <p class="ed-quote">"My son has not stopped talking about this since the party."</p>
              <p class="ed-author">&mdash; Priya M.</p>
            </div>
          </div>

          <!-- Birthday Event Gallery -->
          <div class="event-gallery birthday-gallery">
            <div class="eg-card eg-hero gs-gallery-card">
              <img src="./assets/Images/Images/poster_birthday_1775801639641.png" class="eg-img" alt="Birthday Event" />
            </div>
            <div class="eg-card eg-square gs-gallery-card">
              <img src="./assets/Images/Images/rc_interaction.png" class="eg-img" alt="Birthday Event" />
            </div>
            <div class="eg-card eg-square gs-gallery-card">
              <img src="./assets/Images/Images/slide4-energy.png" class="eg-img" alt="Birthday Event" />
            </div>
            <div class="eg-card eg-portrait gs-gallery-card">
              <img src="./assets/Images/Images/bdeeb743-3f7a-456d-b68c-dbd09e5698c2.png" class="eg-img" alt="Birthday Event" />
            </div>
            <div class="eg-card eg-landscape gs-gallery-card">
              <img src="./assets/Images/Images/hero.png" class="eg-img" alt="Birthday Event" />
            </div>
          </div>

          <div class="ed-testimonial gs-reveal">
            <h4 class="ed-test-title">Testimonial 03 &mdash; House party</h4>
            <div class="ed-tags">
              <span class="ed-tag">Anniversary setup</span><span style="color: rgba(0,0,0,0.3)">&middot;</span><span class="ed-tag">House party</span>
            </div>
            <div class="ed-quote-box">
              <div class="ed-quote-line"></div>
              <p class="ed-quote">"We thought the kids would play. The adults took over."</p>
              <p class="ed-author">&mdash; Anjali &amp; Vikram</p>
            </div>
          </div>

          <!-- House Party Gallery -->
          <div class="event-gallery houseparty-gallery">
            <div class="eg-card eg-landscape gs-gallery-card">
              <img src="./assets/Images/Images/poster_house_party_1775801736000.png" class="eg-img" alt="House Party" />
            </div>
            <div class="eg-card eg-square gs-gallery-card">
              <img src="./assets/Images/Images/poster_friends_1775801757345.png" class="eg-img" alt="House Party" />
            </div>
            <div class="eg-card eg-portrait gs-gallery-card">
              <img src="./assets/Images/Images/poster_apartment_1775801422497.png" class="eg-img" alt="House Party" />
            </div>
            <div class="eg-card eg-square gs-gallery-card">
              <img src="./assets/Images/Images/cat_sumo_1775798396516.png" class="eg-img" alt="House Party" />
            </div>
          </div>

          <div class="ed-testimonial gs-reveal">
            <h4 class="ed-test-title">Testimonial 04 &mdash; School</h4>
            <div class="ed-tags">
              <span class="ed-tag">School fest</span><span style="color: rgba(0,0,0,0.3)">&middot;</span><span class="ed-tag">300+ students</span>
            </div>
            <div class="ed-quote-box">
              <div class="ed-quote-line"></div>
              <p class="ed-quote">"Setup was done before our opening ceremony. Students were already in a queue before we even announced it."</p>
              <p class="ed-author">&mdash; Ms. Divya R., Event Coordinator</p>
            </div>
          </div>

          <!-- School Event Gallery -->
          <div class="event-gallery school-gallery">
            <div class="eg-card eg-hero gs-gallery-card">
              <img src="./assets/Images/Images/poster_generic1_1775801892258.png" class="eg-img" alt="School Event" />
            </div>
            <div class="eg-card eg-square gs-gallery-card">
              <img src="./assets/Images/Images/cat_climb_1775798350271.png" class="eg-img" alt="School Event" />
            </div>
            <div class="eg-card eg-square gs-gallery-card">
              <img src="./assets/Images/Images/ee1244ad-e480-4544-bccc-7f4a4dc7a244.png" class="eg-img" alt="School Event" />
            </div>
            <div class="eg-card eg-portrait gs-gallery-card">
              <img src="./assets/Images/Images/5eb00f5e-1305-4d16-9f01-376ccedf7398.png" class="eg-img" alt="School Event" />
            </div>
            <div class="eg-card eg-landscape gs-gallery-card">
              <img src="./assets/Images/Images/venues_versatility.png" class="eg-img" alt="School Event" />
            </div>
          </div>

        </div>'''

content = content.replace(wall_old, wall_new)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done restoring index.html")
