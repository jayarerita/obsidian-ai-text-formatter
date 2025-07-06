# AI Text Formatter Landing Page

This directory contains the landing page for the AI Text Formatter Obsidian plugin, designed to be deployed via GitHub Pages.

## Files Structure

- `index.html` - Main landing page with modern, responsive design
- `styles.css` - Main stylesheet with CSS custom properties and responsive design
- `mobile.css` - Additional mobile-specific styles and responsive enhancements
- `script.js` - JavaScript for interactive functionality
- `_config.yml` - GitHub Pages configuration
- `assets/` - Directory for images, icons, and other assets (to be added)

## Features

### 🎨 Design
- Modern, clean design with gradient accents
- Fully responsive (mobile-first approach)
- Dark mode support via CSS custom properties
- Accessible design with ARIA labels and semantic HTML

### 📱 Mobile Responsive
- Mobile-first responsive design
- Touch-friendly interactions
- Collapsible mobile navigation
- Optimized layouts for all screen sizes

### ♿ Accessibility
- WCAG 2.1 compliant
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Skip links for screen readers
- High contrast mode support
- Reduced motion support

### ⚡ Performance
- Optimized CSS with custom properties
- Minimal JavaScript footprint
- Lazy loading ready
- Print-friendly styles

## Deployment

### GitHub Pages Setup

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/docs" folder
   - Save settings

2. **Custom Domain** (optional):
   - Add a `CNAME` file with your domain
   - Configure DNS settings

3. **Update URLs**:
   - Replace `jayarerita` in all files with your GitHub username
   - Update social media links and contact information

### Content Updates Needed

#### Images and Assets
Create an `assets/` folder and add:
- `logo.svg` - Plugin logo
- `favicon.ico` - Website favicon
- `apple-touch-icon.png` - iOS home screen icon
- `og-image.png` - Open Graph image for social sharing
- Screenshots of the plugin in action
- Demo video or GIF

#### Content Placeholders
Replace these placeholders in `index.html`:
- Video embed in the demo section
- Screenshots in the screenshots section
- Update GitHub repository URLs
- Add your actual social media handles

#### Customization
- Update color scheme in `styles.css` CSS custom properties
- Modify content sections as needed
- Add analytics tracking code if desired

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

To test locally:
1. Serve the files using a local server (e.g., `python -m http.server`)
2. Open `http://localhost:8000` in your browser
3. Test responsive design using browser dev tools

## SEO Optimization

The page includes:
- Meta tags for SEO
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data ready
- Sitemap generation via Jekyll

## Performance Tips

- Optimize images before adding them
- Consider using WebP format for better compression
- Minimize custom fonts if adding more
- Use lazy loading for images below the fold

## License

This landing page template is part of the AI Text Formatter project and follows the same MIT license.
