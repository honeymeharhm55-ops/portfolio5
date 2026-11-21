# Khuram Latif - Creative Graphic Designer Portfolio

A professional, high-performance, and responsive personal portfolio website designed for **Khuram Latif**, Creative Graphic Designer.

Built with clean semantic HTML5, modern CSS3, vanilla ES6+ JavaScript, and scalable vector graphics (SVG).

---

## 📁 Project Structure

```text
My-Portfolio/
├── images/                         # Optimized vector illustrations and project assets
│   ├── about-profile.svg
│   ├── favicon.svg
│   ├── hero-profile.svg
│   ├── project-1-logo-design.svg
│   ├── project-2-brand-identity.svg
│   ├── project-3-social-media.svg
│   ├── project-4-product-ad.svg
│   ├── project-5-business-card.svg
│   └── project-6-website-ui.svg
├── favicon.svg                     # Root fallback favicon
├── index.html                      # Semantic HTML5 portfolio markup & SEO metadata
├── netlify.toml                    # Netlify production security & caching headers
├── README.md                       # Documentation & deployment guide
├── robots.txt                      # Search engine crawler permissions
├── script.js                       # Interactive UI, navigation, animations & contact form
├── sitemap.xml                     # XML sitemap for Google Search Console
├── style.css                       # Responsive dark-theme design tokens & layouts
└── _redirects                      # Netlify routing configuration
```

---

## 🚀 How to Publish Your Portfolio on Netlify (Step-by-Step)

### Step 1: Create a Free Netlify Account
1. Open your browser and visit [https://www.netlify.com](https://www.netlify.com).
2. Click **Sign Up** in the top right corner.
3. Choose your preferred sign-up method:
   - **Email** (simplest: enter your email and password, then verify your email address).
   - Or sign up with **GitHub**, **GitLab**, or **Google**.
4. Complete the quick onboarding questions (you can select "Personal" / "Portfolio").

---

### Step 2: Upload Your Website Using Netlify Manual Deploy
Netlify offers a 100% free, instant drag-and-drop deployment option that requires zero command-line tools:

1. Log into your [Netlify Dashboard](https://app.netlify.com).
2. Click on the **Sites** tab in the left sidebar.
3. Scroll down to the bottom where you see the dashed box:
   > *"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here."*
4. Open your computer's File Explorer and locate your `My-Portfolio` folder:
   `c:\Users\khura\OneDrive\Desktop\portfolio\My-Portfolio`
5. **Drag the entire `My-Portfolio` folder and drop it into the Netlify dashed box in your browser.**
6. Netlify will upload your files and deploy the site in 5 to 15 seconds.

---

### Step 3: Get and Customize Your Live Website URL
1. Once deployed, Netlify will show **Site overview** with a green badge: **"Production: Published"**.
2. Right below your site status, you will see your live URL (e.g. `https://random-name-12345.netlify.app`). Click it to see your live portfolio!
3. **To customize this URL to your own name for free:**
   - In your site overview, click **Site configuration** (or **Site settings**).
   - Under **Site details**, click **Change site name**.
   - Enter your desired name, for example: `khuram-latif` or `khuramlatif-portfolio`.
   - Click **Save**.
   - Your live website URL is now: `https://khuram-latif.netlify.app`!

---

### Step 4: How to Update Your Website After Making Changes
Whenever you edit code or add new projects in the future:
1. Save your changes locally.
2. Log in to [Netlify](https://app.netlify.com) and click on your portfolio site.
3. Click the **Deploys** tab at the top.
4. Scroll to the dashed box: *"Need to update your site? Drag and drop your site output folder here."*
5. Drag and drop the updated `My-Portfolio` folder into that box.
6. Netlify instantly deploys the update with zero downtime.

---

### Step 5: How to Connect a Custom Domain (Optional)
If you purchase a custom domain (such as `khuramlatif.com` from Namecheap, GoDaddy, or Cloudflare):
1. In your Netlify site dashboard, go to **Site configuration** > **Domain management**.
2. Click **Add a domain** (or **Add custom domain**).
3. Type your domain name (e.g. `khuramlatif.com`) and click **Verify** > **Add domain**.
4. In your domain registrar's DNS management page, add the following two DNS records:
   - **CNAME Record**:
     - Host / Name: `www`
     - Value / Target: `your-site-name.netlify.app`
   - **A Record**:
     - Host / Name: `@`
     - Value: `75.2.60.5` (Netlify's load balancer IP)
5. Netlify will automatically generate a free **SSL certificate (HTTPS)** via Let's Encrypt within a few hours.

---

### Step 6: Connect Live Email Inquiries with EmailJS (Optional)
Your contact form is pre-wired to work with EmailJS:
1. Create a free account at [https://www.emailjs.com](https://www.emailjs.com).
2. In the EmailJS dashboard:
   - **Email Services**: Connect your personal Gmail/Outlook inbox and copy your `SERVICE_ID`.
   - **Email Templates**: Create a new contact form template and copy your `TEMPLATE_ID`.
   - **Account > General**: Copy your `PUBLIC_KEY`.
3. Open `script.js` and update lines 651-655:
   ```javascript
   const EMAILJS_CONFIG = {
       SERVICE_ID: 'YOUR_ACTUAL_SERVICE_ID',
       TEMPLATE_ID: 'YOUR_ACTUAL_TEMPLATE_ID',
       PUBLIC_KEY: 'YOUR_ACTUAL_PUBLIC_KEY'
   };
   ```
4. Save and re-deploy your `My-Portfolio` folder to Netlify.

---

## 📱 Browser & Device Compatibility
- Tested and verified on Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge.
- Fully responsive across mobile (320px–480px), tablet (768px–1024px), and ultra-wide desktop monitors.
- Accessible heading hierarchy (H1–H4), semantic HTML elements, and keyboard-friendly navigation.
