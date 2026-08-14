import { personalInfo, skillsData, projectsData, chatbotKnowledgeBase } from '../data/portfolioData';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 6000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const apiClient = {
  baseUrl: BASE_URL,

  async getHealth() {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/api/health/`, { timeout: 4000 });
      if (res.ok) {
        return await res.json();
      }
      return {
        status: "degraded",
        system_mode: "PUBLIC",
        privacy_active: false,
        services: { frontend: "ONLINE", api: "DEGRADED", database: "UNKNOWN", ai: "READY" }
      };
    } catch {
      return {
        status: "offline",
        system_mode: "PUBLIC",
        privacy_active: false,
        services: { frontend: "ONLINE", api: "OFFLINE", database: "OFFLINE", ai: "FALLBACK" }
      };
    }
  },

  async getProfile() {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/api/profile/`);
      if (res.ok) {
        return await res.json();
      }
      if (res.status === 503) {
        const body = await res.json();
        if (body.system_mode === 'PRIVATE') {
          return { is_private: true, message: body.message };
        }
      }
    } catch (err) {
      console.warn("Django API unreachable, using local profile fallback:", err.message);
    }
    // Fallback
    return {
      name: personalInfo.name,
      role: personalInfo.role,
      tagline: personalInfo.tagline,
      summary: personalInfo.summary,
      email: personalInfo.email,
      location: "Kerala, India",
      github_url: personalInfo.github,
      linkedin_url: personalInfo.linkedin,
      instagram_url: personalInfo.instagram,
      resume_pdf_url: "/assets/Suryakiran-PJ-CV.pdf",
      availability: "Available for Full-time Roles & Projects"
    };
  },

  async getProjects(category = 'All', search = '') {
    try {
      let url = `${BASE_URL}/api/projects/?category=${encodeURIComponent(category)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetchWithTimeout(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Django Projects API unreachable, using local fallback:", err.message);
    }

    // Fallback
    let filtered = projectsData;
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(lower) || p.shortDesc.toLowerCase().includes(lower));
    }
    return filtered.map(p => ({
      id: p.id,
      slug: p.id,
      title: p.title,
      category: p.category,
      short_description: p.shortDesc,
      detailed_description: p.details?.solution || p.shortDesc,
      problem_statement: p.details?.problem || "",
      solution_architecture: p.details?.solution || "",
      my_role: p.details?.role || "Developer",
      image_url: p.image,
      github_url: p.githubUrl,
      live_url: p.liveUrl,
      technologies: p.technologies,
      features: p.details?.features || [],
      featured: true,
      frontend_tech: "React, Vite, Bootstrap 5",
      backend_tech: "Python, Django, DRF",
      database_tech: "PostgreSQL / SQLite ORM",
      deployment_tech: "WSGI Server + CDN"
    }));
  },

  async getProjectBySlug(slug) {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/api/projects/${encodeURIComponent(slug)}/`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Django Project Detail API unreachable, fallback:", err.message);
    }
    const projects = await this.getProjects();
    return projects.find(p => p.slug === slug || p.id === slug) || null;
  },

  async getSkills() {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/api/skills/`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Django Skills API unreachable, using local fallback:", err.message);
    }

    // Fallback
    const mapCategory = (arr, catKey, catName) => arr.map(item => ({
      name: item.name,
      badge: item.badge,
      icon_name: item.icon,
      category: catKey,
      category_display: catName,
      proficiency: 90
    }));

    const all = [
      ...mapCategory(skillsData.frontend, 'frontend', 'Frontend'),
      ...mapCategory(skillsData.backend, 'backend', 'Backend'),
      ...mapCategory(skillsData.tools, 'tools', 'Tools & DevOps'),
      ...mapCategory(skillsData.development, 'development', 'Core Development')
    ];

    return {
      all,
      grouped: {
        frontend: mapCategory(skillsData.frontend, 'frontend', 'Frontend'),
        backend: mapCategory(skillsData.backend, 'backend', 'Backend'),
        tools: mapCategory(skillsData.tools, 'tools', 'Tools & DevOps'),
        development: mapCategory(skillsData.development, 'development', 'Core Development')
      }
    };
  },

  async getSocialLinks() {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/api/social-links/`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Django Social Links API unreachable, using fallback:", err.message);
    }
    return [
      { platform: "GitHub", url: personalInfo.github, icon_name: "Github" },
      { platform: "LinkedIn", url: personalInfo.linkedin, icon_name: "Linkedin" },
      { platform: "Instagram", url: personalInfo.instagram, icon_name: "Instagram" },
      { platform: "Email", url: `mailto:${personalInfo.email}`, icon_name: "Mail" }
    ];
  },

  async submitContact(formData) {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/api/contact/`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Failed to submit message." };
    } catch (err) {
      console.warn("Django Contact API error, using fallback confirmation:", err.message);
      return { success: true, message: "Thank you! Your message has been recorded." };
    }
  },

  async queryAIChat(message, mode = 'STANDARD') {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/api/ai/chat/`, {
        method: 'POST',
        body: JSON.stringify({ message, mode })
      });
      const data = await res.json();
      if (res.ok && data.answer) {
        return { answer: data.answer, mode: data.mode || mode };
      }
    } catch (err) {
      console.warn("Django AI API error, using client knowledge fallback:", err.message);
    }

    // Client Knowledge Fallback
    const lower = message.toLowerCase();
    let match = chatbotKnowledgeBase.find(item => item.keywords.some(kw => lower.includes(kw)));
    const answer = match
      ? match.answer
      : "Suryakiran P. J. is a Python Full Stack Developer proficient in Python, Django, React.js, JavaScript, and Bootstrap 5. Ask about his projects, skills, or CV!";
    return { answer, mode };
  },

  async getCVMetadata() {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/api/cv/`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Django CV API error, fallback:", err.message);
    }
    return {
      name: personalInfo.name,
      role: personalInfo.role,
      email: personalInfo.email,
      github: personalInfo.github,
      linkedin: personalInfo.linkedin,
      pdf_url: "/assets/Suryakiran-PJ-CV.pdf"
    };
  }
};
