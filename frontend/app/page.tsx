"use client";

import Link from "next/link";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { useEffect } from "react";
import { fetchSliders } from "./restapi/slider";
import {
  nextSlide,
  previousSlide,
  setCurrentSlideIndex,
} from "./store/slices/sliderSlice";
import styles from "./styles/home.module.css";

export default function Home() {
  const { sliders, loading, currentSlideIndex } = useAppSelector(
    (state) => state.slider
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  // Auto-play slider
  useEffect(() => {
    if (sliders.length > 0) {
      const interval = setInterval(() => {
        dispatch(nextSlide());
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [sliders.length, dispatch]);

  const handlePrevSlide = () => {
    dispatch(previousSlide());
  };

  const handleNextSlide = () => {
    dispatch(nextSlide());
  };

  const currentSlider = sliders[currentSlideIndex];

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Hero Slider Section */}
        {loading ? (
          <div className={styles.sliderLoading}>
            <div className={styles.spinner}></div>
            <p>Loading content...</p>
          </div>
        ) : sliders.length > 0 && currentSlider ? (
          <section className={styles.heroSlider}>
            <div className={styles.sliderContainer}>
              <div
                className={styles.sliderImage}
                style={{
                  backgroundImage: `url(${currentSlider.image_url})`,
                }}
              >
                <div className={styles.sliderOverlay}></div>
              </div>
              <div className={styles.sliderContent}>
                <div className={styles.sliderTextContainer}>
                  <h1 className={styles.sliderTitle}>{currentSlider.title}</h1>
                  <p className={styles.sliderSubtitle}>
                    {currentSlider.subtitle}
                  </p>
                  <div className={styles.sliderActions}>
                    <Link href="/admin/login" className={styles.primaryButton}>
                      Get Started
                    </Link>
                    <button className={styles.secondaryButton}>
                      Learn More
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider Navigation */}
              {sliders.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className={styles.sliderNavButton}
                    style={{ left: "2rem" }}
                    aria-label="Previous slide"
                  >
                    <svg
                      className={styles.sliderNavIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className={styles.sliderNavButton}
                    style={{ right: "2rem" }}
                    aria-label="Next slide"
                  >
                    <svg
                      className={styles.sliderNavIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Slider Indicators */}
                  <div className={styles.sliderIndicators}>
                    {sliders.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => dispatch(setCurrentSlideIndex(index))}
                        className={`${styles.indicator} ${
                          index === currentSlideIndex
                            ? styles.indicatorActive
                            : ""
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        ) : null}

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaTitle}>
              Ready to Transform Your Business?
            </h2>
            <p className={styles.ctaDescription}>
              Join thousands of companies already leveraging our enterprise
              solutions to achieve their goals.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/admin/login" className={styles.ctaPrimaryButton}>
                Start Free Trial
              </Link>
              <button className={styles.ctaSecondaryButton}>
                Schedule Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerColumn}>
              <div className={styles.footerLogo}>
                <svg
                  className={styles.footerLogoIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={styles.footerBrand}>Kreatif</span>
              </div>
              <p className={styles.footerDescription}>
                Enterprise solutions for modern businesses. Empowering companies
                worldwide with innovative technology.
              </p>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Product</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Company</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <a href="#" className={styles.footerLink}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Resources</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.footerLink}>
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>
              &copy; 2025 Kreatif. All rights reserved.
            </p>
            <div className={styles.footerBottomLinks}>
              <a href="#" className={styles.footerBottomLink}>
                Privacy Policy
              </a>
              <a href="#" className={styles.footerBottomLink}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
