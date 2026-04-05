export const en = {
  nav: { services: 'Services', projects: 'Projects', certifications: 'Certifications', team: 'Team', contact: 'Contact', requestQuote: 'Request Quote' },
  hero: { scrollDown: 'Scroll Down' },
  services: { sectionLabel: 'What We Do' },
  projects: {
    sectionLabel: 'Portfolio', filterAll: 'All', filterCompletions: 'Completions',
    filterRefurb: 'Refurbishment', filterVip: 'VIP', filterMilitary: 'Military', filterCargo: 'Cargo',
    featured: 'Featured', aircraft: 'Aircraft', client: 'Client', year: 'Year', tags: 'Tags',
  },
  certifications: {
    sectionLabel: 'Credentials', showMore: 'Show More', showLess: 'Show Less',
    issued: 'Issued', viewCredential: 'View Credential',
  },
  team: { sectionLabel: 'The Experts', viewLinkedIn: 'LinkedIn Profile' },
  contact: {
    sectionLabel: 'Get In Touch',
    namePlaceholder: 'Full Name *', companyPlaceholder: 'Company',
    emailPlaceholder: 'Email Address *', phonePlaceholder: 'Phone Number',
    aircraftPlaceholder: 'Aircraft Model', serviceLabel: 'Service Type',
    selectService: 'Select a service...', messagePlaceholder: 'Tell us about your project *',
    submit: 'Send Message', sending: 'Sending...',
    successTitle: 'Message Sent!', successMsg: "We'll get back to you within 24 hours.",
    errorMsg: 'Failed to send message. Please try again.',
    required: 'This field is required', invalidEmail: 'Invalid email address',
  },
  footer: {
    quickLinks: 'Quick Links', followUs: 'Follow Us',
    allRights: 'All rights reserved.', builtWith: 'Built with', builtFor: 'for the aviation industry',
  },
  admin: {
    login: { title: 'Admin Access', subtitle: 'Aircraft Interiors Solutions', email: 'Email', password: 'Password', submit: 'Sign In', error: 'Invalid credentials' },
    dashboard: { title: 'Dashboard', projects: 'Projects', messages: 'Messages', downloads: 'Downloads', services: 'Services', team: 'Team', unread: 'Unread' },
    common: {
      add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel',
      visible: 'Visible', hidden: 'Hidden', dragToReorder: 'Drag to reorder',
      confirmDelete: 'Are you sure?', saved: 'Saved successfully', deleted: 'Deleted', error: 'Something went wrong',
    },
  },
}

export type Translations = typeof en
