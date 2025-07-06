# Deployment Guide - GitHub Pages Landing Page

This guide will help you deploy the AI Text Formatter landing page to GitHub Pages.

## 🚀 Quick Deployment

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: **main** (or your default branch)
   - Folder: **/docs**
5. Click **Save**

Your site will be available at: `https://jayarerita.github.io/obsidian-ai-text-formatter/`

### Step 2: Update Repository URLs

Replace all instances of `jayarerita` in the following files:
- `docs/index.html`
- `docs/_config.yml`

Find and replace:
```
jayarerita → your-actual-github-username
```

### Step 3: Add Your Content

#### Required Assets
Create these files in `docs/assets/`:
- `favicon.ico` - Website favicon (16x16, 32x32 px)
- `apple-touch-icon.png` - iOS icon (180x180 px)
- `og-image.png` - Social sharing image (1200x630 px)

#### Screenshots
Add plugin screenshots to replace placeholders:
1. Context menu screenshot
2. Settings panel screenshot  
3. Format selection modal screenshot

#### Demo Video
Replace the video placeholder in the demo section with:
- YouTube embed
- Vimeo embed
- Direct video file
- Animated GIF

## 🎨 Customization

### Colors and Branding
Edit CSS custom properties in `docs/styles.css`:

```css
:root {
    --primary-color: #6366f1;     /* Your brand color */
    --secondary-color: #10b981;   /* Accent color */
    --accent-color: #f59e0b;      /* Highlight color */
}
```

### Content Updates
Edit `docs/index.html` to update:
- Hero section text
- Feature descriptions
- Installation instructions
- Contact information

### Analytics (Optional)
Add Google Analytics to `docs/_config.yml`:
```yaml
google_analytics: UA-XXXXXXXX-X
```

## 🔧 Advanced Configuration

### Custom Domain
1. Add a `CNAME` file to `docs/` folder:
   ```
   your-domain.com
   ```
2. Configure DNS with your domain provider:
   - Add CNAME record pointing to `jayarerita.github.io`

### SEO Optimization
Update meta tags in `docs/index.html`:
- Title and description
- Open Graph tags
- Twitter Card tags
- Keywords

### Performance Optimization
1. **Optimize Images**:
   - Use WebP format when possible
   - Compress images (TinyPNG, ImageOptim)
   - Use appropriate sizes

2. **Enable Compression**:
   Add `.htaccess` or `_headers` file for compression

3. **Lazy Loading**:
   Add `loading="lazy"` to images below the fold

## 📱 Mobile Testing

Test your site on various devices:
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)
- Desktop browsers

Use browser dev tools to simulate different screen sizes.

## 🔍 SEO Checklist

- [ ] Unique page title and meta description
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags
- [ ] Proper heading hierarchy (H1, H2, H3)
- [ ] Alt text for all images
- [ ] Internal linking structure
- [ ] Mobile-friendly design
- [ ] Fast loading speed
- [ ] HTTPS enabled (automatic with GitHub Pages)

## 🚨 Troubleshooting

### Site Not Loading
- Check GitHub Pages settings
- Ensure `docs/` folder exists with `index.html`
- Wait 5-10 minutes for deployment

### Styling Issues
- Check CSS file paths
- Verify mobile.css is linked
- Test in different browsers

### Mobile Issues
- Test responsive design
- Check touch targets (44px minimum)
- Verify mobile navigation works

### Performance Issues
- Optimize images
- Minimize CSS/JS
- Use browser caching

## 📊 Analytics and Monitoring

### Google Analytics Setup
1. Create GA4 property
2. Add tracking code to `_config.yml`
3. Verify tracking in GA dashboard

### Core Web Vitals
Monitor your site's performance:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

### Tools for Monitoring
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse (built into Chrome DevTools)

## 🔄 Updates and Maintenance

### Regular Updates
- Keep content current
- Update screenshots when plugin changes
- Monitor and fix broken links
- Update dependencies

### Version Control
- Use semantic versioning for major updates
- Tag releases for easy rollback
- Document changes in commit messages

## 🆘 Support

If you encounter issues:
1. Check GitHub Pages documentation
2. Verify all file paths are correct
3. Test locally before deploying
4. Check browser console for errors

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mobile-First Design](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)

---

**Note**: The landing page is designed to work without Jekyll, but GitHub Pages will automatically process it through Jekyll. The `_config.yml` file provides additional SEO and functionality benefits.
