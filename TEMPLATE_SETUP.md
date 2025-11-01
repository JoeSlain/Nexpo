# Making This Repository a GitHub Template

This guide explains how to turn this repository into a GitHub template repository that others can easily use.

## Step 1: Enable Template Repository

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to find **Template repository** section
4. Check the box: **☑ Template repository**
5. Click **Save changes**

## Step 2: Verify Template Status

After enabling, users will see:
- A "Use this template" button when viewing your repository
- The repository will be searchable with the `template` filter on GitHub

## Step 3: Update Deploy Button (Optional)

If you want to add a Vercel deploy button to your README, update the button URL in `README.md`:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_REPO_URL&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&root-directory=apps/next)
```

Replace `YOUR_GITHUB_REPO_URL` with your actual repository URL.

## Step 4: Test Template Creation

1. Click "Use this template" on your repository
2. Create a new repository from the template
3. Clone the new repository
4. Verify all files were copied correctly
5. Follow the setup instructions in `README.md`

## Template Features Included

This repository includes:

- ✅ `.env.example` files for easy environment setup
- ✅ Comprehensive `README.md` with setup instructions
- ✅ `SETUP.md` with quick setup guide
- ✅ `vercel.json` for automatic Vercel deployment
- ✅ GitHub Actions workflow for CI/CD
- ✅ Issue templates for bug reports and feature requests
- ✅ Template description for GitHub

## Customization

After users create a repository from this template, they should:

1. Update `package.json` name
2. Update `supabase/config.toml` project_id
3. Set up environment variables
4. Configure Supabase project
5. Update hardcoded URLs and API endpoints
6. Customize branding and app name

## Best Practices

- Keep the template simple and well-documented
- Include example files (`.env.example`) but never commit real credentials
- Provide clear setup instructions
- Keep dependencies up to date
- Document all required environment variables
- Include troubleshooting sections

