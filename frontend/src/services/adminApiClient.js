const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'https://suryakiran-portfolio-api.onrender.com'
).replace(/\/$/, '');

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem('suryakiran_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = getAuthHeaders(options.headers);
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // If unauthorized, handle session expiry
    if (response.status === 401 && !endpoint.includes('/login/')) {
      localStorage.removeItem('suryakiran_admin_token');
      localStorage.removeItem('suryakiran_admin_user');
      window.dispatchEvent(new CustomEvent('admin-auth-expired'));
      throw new Error('Your session has expired. Please log in again.');
    }

    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Parse detailed error message from Django REST Framework
      let errorMsg = data.message || data.detail || 'An unexpected error occurred.';
      if (data && typeof data === 'object' && !data.message && !data.detail) {
        const fieldErrors = Object.entries(data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
        if (fieldErrors) errorMsg = fieldErrors;
      }
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const adminApiClient = {
  baseUrl: BASE_URL,

  // Authentication
  async login(username, password) {
    return request('/api/admin/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout() {
    try {
      await request('/api/admin/logout/', { method: 'POST' });
    } catch (e) {
      console.warn('Logout notice:', e.message);
    } finally {
      localStorage.removeItem('suryakiran_admin_token');
      localStorage.removeItem('suryakiran_admin_user');
    }
  },

  async getMe() {
    return request('/api/admin/me/');
  },

  async getStats() {
    return request('/api/admin/stats/');
  },

  // Projects CRUD
  async getProjects() {
    return request('/api/admin/projects/');
  },

  async getProject(id) {
    return request(`/api/admin/projects/${id}/`);
  },

  async createProject(projectData) {
    return request('/api/admin/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  async updateProject(id, projectData) {
    return request(`/api/admin/projects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(projectData),
    });
  },

  async deleteProject(id) {
    return request(`/api/admin/projects/${id}/`, {
      method: 'DELETE',
    });
  },

  // Skills CRUD
  async getSkills() {
    return request('/api/admin/skills/');
  },

  async createSkill(skillData) {
    return request('/api/admin/skills/', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  },

  async updateSkill(id, skillData) {
    return request(`/api/admin/skills/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(skillData),
    });
  },

  async deleteSkill(id) {
    return request(`/api/admin/skills/${id}/`, {
      method: 'DELETE',
    });
  },

  // Services CRUD
  async getServices() {
    return request('/api/admin/services/');
  },

  async createService(serviceData) {
    return request('/api/admin/services/', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },

  async updateService(id, serviceData) {
    return request(`/api/admin/services/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(serviceData),
    });
  },

  async deleteService(id) {
    return request(`/api/admin/services/${id}/`, {
      method: 'DELETE',
    });
  },

  // Experience CRUD
  async getExperience() {
    return request('/api/admin/experience/');
  },

  async createExperience(expData) {
    return request('/api/admin/experience/', {
      method: 'POST',
      body: JSON.stringify(expData),
    });
  },

  async updateExperience(id, expData) {
    return request(`/api/admin/experience/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(expData),
    });
  },

  async deleteExperience(id) {
    return request(`/api/admin/experience/${id}/`, {
      method: 'DELETE',
    });
  },

  // Education CRUD
  async getEducation() {
    return request('/api/admin/education/');
  },

  async createEducation(eduData) {
    return request('/api/admin/education/', {
      method: 'POST',
      body: JSON.stringify(eduData),
    });
  },

  async updateEducation(id, eduData) {
    return request(`/api/admin/education/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(eduData),
    });
  },

  async deleteEducation(id) {
    return request(`/api/admin/education/${id}/`, {
      method: 'DELETE',
    });
  },

  // Certifications CRUD
  async getCertifications() {
    return request('/api/admin/certifications/');
  },

  async createCertification(certData) {
    return request('/api/admin/certifications/', {
      method: 'POST',
      body: JSON.stringify(certData),
    });
  },

  async updateCertification(id, certData) {
    return request(`/api/admin/certifications/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(certData),
    });
  },

  async deleteCertification(id) {
    return request(`/api/admin/certifications/${id}/`, {
      method: 'DELETE',
    });
  },

  // Achievements CRUD
  async getAchievements() {
    return request('/api/admin/achievements/');
  },

  async createAchievement(data) {
    return request('/api/admin/achievements/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAchievement(id, data) {
    return request(`/api/admin/achievements/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteAchievement(id) {
    return request(`/api/admin/achievements/${id}/`, {
      method: 'DELETE',
    });
  },

  // Social Links CRUD
  async getSocialLinks() {
    return request('/api/admin/social-links/');
  },

  async createSocialLink(data) {
    return request('/api/admin/social-links/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSocialLink(id, data) {
    return request(`/api/admin/social-links/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteSocialLink(id) {
    return request(`/api/admin/social-links/${id}/`, {
      method: 'DELETE',
    });
  },

  // Profile
  async getProfile() {
    return request('/api/admin/profile/');
  },

  async updateProfile(profileData) {
    return request('/api/admin/profile/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },

  // AI Knowledge Documents
  async getAIDocuments() {
    return request('/api/admin/ai-documents/');
  },

  async createAIDocument(data) {
    return request('/api/admin/ai-documents/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAIDocument(id, data) {
    return request(`/api/admin/ai-documents/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteAIDocument(id) {
    return request(`/api/admin/ai-documents/${id}/`, {
      method: 'DELETE',
    });
  },

  // Contact Messages
  async getMessages(unreadOnly = false) {
    const query = unreadOnly ? '?unread=true' : '';
    return request(`/api/admin/messages/${query}`);
  },

  async updateMessage(id, data) {
    return request(`/api/admin/messages/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteMessage(id) {
    return request(`/api/admin/messages/${id}/`, {
      method: 'DELETE',
    });
  },

  // Site Settings
  async getSiteSettings() {
    return request('/api/admin/site-settings/');
  },

  async updateSiteSettings(data) {
    return request('/api/admin/site-settings/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Audit Logs
  async getAuditLogs() {
    return request('/api/admin/audit-logs/');
  }
};
