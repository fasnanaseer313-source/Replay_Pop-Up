import sys

content = open('index.html', 'r', encoding='utf-8').read()

insert_point = '''    </section>

    <!-- 7b. INSTAGRAM PULL -->'''

if insert_point not in content:
    print('Insert point not found!')
    sys.exit(1)

new_section = '''    </section>

    <!-- 7a. GOOGLE REVIEWS -->
    <section id="s-google-reviews" class="google-reviews-section">
      <style>
        .google-reviews-section {
          padding: 100px 20px;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
          border-bottom: 1px dashed rgba(255,255,255,0.1);
        }
        .google-reviews-section::before {
          content: "";
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at center, rgba(232,98,26,0.03) 0%, transparent 70%);
          pointer-events: none;
        }
        .gr-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .gr-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 60px;
        }
        @media (max-width: 768px) {
          .gr-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }
        }
        .gr-left h2 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.1;
          margin-bottom: 20px;
          font-family: var(--f-heading, 'Inter', sans-serif);
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .gr-left p.subheading {
          font-size: 1.2rem;
          color: #bbb;
          font-family: var(--f-body);
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .gr-rating-display {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
          font-family: var(--f-body);
        }
        @media (max-width: 768px) {
          .gr-rating-display {
            justify-content: center;
          }
        }
        .stars {
          color: #fbbc05; /* Google Yellow */
          font-size: 1.5rem;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(251, 188, 5, 0.4);
        }
        .rating-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }
        .review-count {
          color: #888;
          font-size: 1rem;
        }
        .trust-indicators {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        @media (max-width: 768px) {
          .trust-indicators {
            grid-template-columns: 1fr;
          }
        }
        .trust-indicators li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ccc;
          font-size: 1.05rem;
          font-family: var(--f-body);
        }
        @media (max-width: 768px) {
          .trust-indicators li {
            justify-content: center;
          }
        }
        .trust-indicators li svg {
          color: var(--orange);
          flex-shrink: 0;
        }

        .gr-right {
          display: flex;
          justify-content: flex-end;
        }
        @media (max-width: 768px) {
          .gr-right {
            justify-content: center;
          }
        }
        .gr-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05);
          width: 100%;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          transition: transform 0.3s ease;
        }
        .gr-card:hover {
          transform: translateY(-5px);
          border-color: rgba(232, 98, 26, 0.3);
          box-shadow: 0 25px 50px rgba(0,0,0,0.6), 0 0 40px rgba(232, 98, 26, 0.15), inset 0 0 0 1px rgba(232, 98, 26, 0.2);
        }
        .google-logo {
          width: 50px;
          height: 50px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .google-logo svg {
          width: 24px;
          height: 24px;
        }
        .gr-card h4 {
          color: #fff;
          font-size: 1.8rem;
          margin-bottom: 10px;
          font-family: var(--f-heading);
        }
        .gr-card p {
          color: #aaa;
          font-size: 1rem;
          margin-bottom: 30px;
          font-family: var(--f-body);
        }
        .qr-placeholder {
          width: 120px;
          height: 120px;
          background: #fff;
          border-radius: 12px;
          padding: 5px;
          margin-bottom: 30px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.4);
        }
        .qr-placeholder img {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          object-fit: cover;
        }
        .btn-google {
          background: transparent;
          border: 1px solid var(--orange);
          color: var(--orange);
          padding: 15px 30px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          font-family: var(--f-body);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(232, 98, 26, 0.1);
          width: 100%;
          justify-content: center;
        }
        .btn-google:hover {
          background: var(--orange);
          color: #fff;
          box-shadow: 0 0 30px rgba(232, 98, 26, 0.4);
          transform: translateY(-2px);
        }
        .btn-google svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        /* Marquee */
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 20px 0;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: scroll-left 40s linear infinite;
        }
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .mini-review {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          margin-right: 20px;
          width: 350px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: background 0.3s ease;
        }
        .mini-review:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .mr-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mr-stars {
          color: #fbbc05;
          font-size: 1rem;
          letter-spacing: 1px;
        }
        .mr-google-icon svg {
          width: 16px;
          height: 16px;
        }
        .mr-text {
          color: #ddd;
          font-size: 0.95rem;
          line-height: 1.5;
          font-family: var(--f-body);
        }
        .mr-author {
          color: #888;
          font-size: 0.85rem;
          font-family: var(--f-body);
          font-weight: 600;
        }
      </style>

      <div class="gr-container">
        <div class="gr-grid">
          <!-- LEFT -->
          <div class="gr-left gs-reveal">
            <h2><span class="orange" style="font-family: var(--f-serif, 'Instrument Serif', serif); font-style: italic; font-weight: normal;">Loved The</span> Experience?</h2>
            <p class="subheading">Share your RC racing experience and help others discover unforgettable events.</p>
            
            <div class="gr-rating-display">
              <span class="rating-text">4.9/5</span>
              <span class="stars">★★★★★</span>
              <span class="review-count">Based on 250+ Reviews</span>
            </div>

            <ul class="trust-indicators">
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Verified Customers
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Corporate Events
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Birthday Parties
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                School Events
              </li>
            </ul>
          </div>

          <!-- RIGHT -->
          <div class="gr-right gs-reveal">
            <div class="gr-card">
              <div class="google-logo">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <h4>Rate Your Experience</h4>
              <p>Scan the code or click the button to leave us a quick review on Google. It only takes a minute!</p>
              
              <div class="qr-placeholder">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://g.page/r/" alt="Google Review QR Code">
              </div>

              <a href="#" class="btn-google">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                </svg>
                Review Us On Google
              </a>
            </div>
          </div>
        </div>

        <!-- MARQUEE -->
        <div class="marquee-wrapper gs-reveal">
          <div class="marquee-track">
            <!-- Set 1 -->
            <div class="mini-review">
              <div class="mr-header">
                <div class="mr-stars">★★★★★</div>
                <div class="mr-google-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
              <div class="mr-text">"The absolute highlight of our corporate offsite! Everyone was hooked and the setup was flawless."</div>
              <div class="mr-author">Sarah Jenkins</div>
            </div>
            <div class="mini-review">
              <div class="mr-header">
                <div class="mr-stars">★★★★★</div>
                <div class="mr-google-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
              <div class="mr-text">"Booked them for my son's 10th birthday. Best decision ever. The kids didn't want it to end!"</div>
              <div class="mr-author">Rahul Desai</div>
            </div>
            <div class="mini-review">
              <div class="mr-header">
                <div class="mr-stars">★★★★★</div>
                <div class="mr-google-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
              <div class="mr-text">"A unique experience that brought incredible energy to our college fest. Highly recommended."</div>
              <div class="mr-author">Aarav M.</div>
            </div>
            <div class="mini-review">
              <div class="mr-header">
                <div class="mr-stars">★★★★★</div>
                <div class="mr-google-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
              <div class="mr-text">"Premium quality RC cars and the track setup was so professional. Great team behind this."</div>
              <div class="mr-author">Vikram Singh</div>
            </div>

            <!-- Set 2 (Duplicate for infinite scroll) -->
            <div class="mini-review">
              <div class="mr-header">
                <div class="mr-stars">★★★★★</div>
                <div class="mr-google-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
              <div class="mr-text">"The absolute highlight of our corporate offsite! Everyone was hooked and the setup was flawless."</div>
              <div class="mr-author">Sarah Jenkins</div>
            </div>
            <div class="mini-review">
              <div class="mr-header">
                <div class="mr-stars">★★★★★</div>
                <div class="mr-google-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
              <div class="mr-text">"Booked them for my son's 10th birthday. Best decision ever. The kids didn't want it to end!"</div>
              <div class="mr-author">Rahul Desai</div>
            </div>
            <div class="mini-review">
              <div class="mr-header">
                <div class="mr-stars">★★★★★</div>
                <div class="mr-google-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
              <div class="mr-text">"A unique experience that brought incredible energy to our college fest. Highly recommended."</div>
              <div class="mr-author">Aarav M.</div>
            </div>
            <div class="mini-review">
              <div class="mr-header">
                <div class="mr-stars">★★★★★</div>
                <div class="mr-google-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
              <div class="mr-text">"Premium quality RC cars and the track setup was so professional. Great team behind this."</div>
              <div class="mr-author">Vikram Singh</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7b. INSTAGRAM PULL -->'''

content = content.replace(insert_point, new_section)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully inserted Google Reviews section')
