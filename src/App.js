import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import profileData from './data/profile.json';
import './App.css';

// Lazy load components
const SkillsShowcase = lazy(() => import('./components/SkillsShowcase'));
const ThreeBackground = lazy(() => import('./components/ThreeBackground'));
const GlassSection = lazy(() => import('./components/GlassSection'));
const ProfilePhoto = lazy(() => import('./components/ProfilePhoto'));

// Experience item component to properly use hooks
const ExperienceItem = ({ experience, index }) => {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: false, amount: 0.3 });
  
  return (
    <motion.div 
      ref={itemRef}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="experience-header">
        {experience.logo && (
          <img 
            src={experience.logo} 
            alt={`${experience.company} logo`} 
            className="company-logo" 
          />
        )}
        <div>
          <h3>{experience.title}</h3>
          <span className="timeline-date">{experience.period}</span>
          <p>{experience.company}</p>
        </div>
      </div>
      <ul>
        {experience.description.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </motion.div>
  );
};

// Load the fallbacks to use while components are loading
const LoadingFallback = () => <div className="loading-placeholder"></div>;

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
  
    try {
      const response = await fetch('https://formspree.io/f/xyzwejjk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <Suspense fallback={<div className="loading-placeholder bg-placeholder"></div>}>
        <ThreeBackground />
      </Suspense>
      <div className="content">
        <Suspense fallback={<LoadingFallback />}>
          <ProfilePhoto name={profileData.personal.name} image={profileData.personal.profileImage} />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <GlassSection title="Summary" index={0}>
            <p>{profileData.personal.summary}</p>
          </GlassSection>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <GlassSection title="Experience" index={1} timeline>
            {profileData.experience.map((exp, index) => (
              <ExperienceItem key={index} experience={exp} index={index} />
            ))}
          </GlassSection>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <GlassSection title="Education" index={2}>
            <motion.div 
              className="education-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="education-header">
                {profileData.education[0].logo && (
                  <img 
                    src={profileData.education[0].logo} 
                    alt="University logo"
                    className="university-logo"
                  />
                )}
                <div>
                  <h3>{profileData.education[0].degree}</h3>
                  <h4>{profileData.education[0].institution}</h4>
                  <span className="education-period">{profileData.education[0].period}</span>
                </div>
              </div>
              <ul>
                {profileData.education[0].description.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </motion.div>
          </GlassSection>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <GlassSection title="Skills" index={3}>
            <SkillsShowcase skills={profileData.skills} />
          </GlassSection>
        </Suspense>

        {/* <GlassSection title="Projects" index={4}>
          <div className="projects-grid">
            {profileData.projects.map((project, index) => (
              <div className="project-card" key={index}>
                <img src={project.image} alt={`${project.title} Screenshot`} className="project-screenshot" />
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-links">
                  <a href={project.links.demo}>Live Demo</a>
                  <a href={project.links.github}>GitHub</a>
                </div>
              </div>
            ))}
          </div>
        </GlassSection> */}

        <Suspense fallback={<LoadingFallback />}>
          <GlassSection title="Contact" index={5}>
            <div className="contact-container">
              <div className="contact-info">
                <h3>Get in Touch</h3>
                <p>Feel free to reach out to me for any opportunities or just to say hello!</p>
                <div className="contact-details">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>{profileData.contact.email}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <span>{profileData.contact.phone}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{profileData.contact.location}</span>
                  </div>
                </div>
              </div>
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="send-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  {submitStatus === 'success' && (
                    <div className="submit-message success">
                      Message sent successfully!
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="submit-message error">
                      Failed to send message. Please try again.
                    </div>
                  )}
                </form>
              </div>
              <div className="social-links">
                {profileData.contact.social.map((social, index) => (
                  <a href={social.url} className="social-link" key={index}>
                    <i className={`fab fa-${social.platform.toLowerCase()}`}></i>
                    <span>{social.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </GlassSection>
        </Suspense>
      </div>
    </div>
  );
};

export default App;
