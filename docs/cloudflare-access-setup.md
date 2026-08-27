# Setting up Cloudflare Access, step by step

This is the walkthrough for the one thing standing between "the hub works" and
"the hub is actually restricted to remotebase.com, snapdev.ai, and ember.new."
Right now the deployed site has no login gate at all - anyone with the link
can open it. This guide closes that gap, for free, with no code changes.

Written for someone doing this for the first time, with no prior Cloudflare
account. Budget 30-45 minutes, plus however long DNS takes to update (usually
minutes, occasionally a few hours).

---

## Step 0: two decisions before you touch anything

**1. Which domain will host the hub?**

You need exactly **one** of the three domains (`remotebase.com`, `snapdev.ai`,
`ember.new`) to move its DNS to Cloudflare. It does not matter which one -
the login policy will still allow all three email domains regardless of
which domain the hub's URL lives under. This guide uses `remotebase.com` and
`hub.remotebase.com` as the example throughout; swap in whichever domain you
actually have access to.

**2. Who manages that domain's DNS today, and are you looping them in?**

Moving a domain to Cloudflare means changing its **nameservers** at the
domain registrar (GoDaddy, Namecheap, Google Domains, etc.) - and nameservers
control DNS for the *entire* domain, not just a subdomain. That includes
things like email (MX records) and any other services already running on
it. This is not dangerous if done carefully (Cloudflare scans and imports
your existing DNS records automatically when you add the domain, and nothing
routes through Cloudflare until you actually change the nameservers), but it
is a company-wide change, not a personal one. If you are not the person who
manages `remotebase.com`'s DNS/registrar today, loop them in before Step 3
below - the rest of the setup (Steps 1-2 and 5 onward) can be done by anyone.

---

## Step 1: create a free Cloudflare account

1. Go to the Cloudflare sign-up page and create an account with your work
   email. No credit card is required for what we're doing here.
2. Verify your email if prompted.

## Step 2: add your domain to Cloudflare

1. From the Cloudflare dashboard, choose **Add a domain** (sometimes shown
   as **Add a site**).
2. Type in the domain - `remotebase.com` (or whichever you picked in Step 0).
3. Cloudflare will scan the domain's current DNS records and show you a list
   of what it found. **Review this list carefully with whoever manages DNS
   today** - confirm nothing important (especially MX/email records) is
   missing before continuing. Cloudflare's scan is usually accurate but not
   guaranteed to catch everything.
4. Select the **Free** plan when asked. Nothing in this setup needs a paid
   plan.

## Step 3: point the domain's nameservers at Cloudflare

This is the step that needs registrar access (GoDaddy, Namecheap, etc. -
wherever `remotebase.com` was originally purchased/registered).

1. Cloudflare will show you two nameserver addresses, like
   `aaa.ns.cloudflare.com` and `bbb.ns.cloudflare.com` (the actual names are
   unique to your account - copy them exactly).
2. Log into the domain registrar, find the DNS/nameserver settings for
   `remotebase.com`, and replace the existing nameservers with the two
   Cloudflare gave you.
3. Save. This step **must** happen at the registrar - Cloudflare cannot do
   it for you, and there's no way around it for a domain you don't already
   host at Cloudflare.

## Step 4: wait for activation

1. Nameserver changes can take anywhere from a few minutes to about 24
   hours to propagate (it's usually fast - well under an hour in most
   cases).
2. Cloudflare emails you once it detects the change and the domain is
   active. You can also refresh the Cloudflare dashboard - the domain's
   status changes from "Pending" to "Active."
3. Don't move on to Step 5 until it shows Active.

## Step 5: point a subdomain at the hub

1. In the Cloudflare dashboard, go to **DNS** for `remotebase.com`.
2. Add a new record:
   - **Type**: `CNAME`
   - **Name**: `hub` (this creates `hub.remotebase.com`)
   - **Target**: your Render or Vercel deployment URL (e.g.
     `remotebase-employee-hub.vercel.app` or `<your-app>.onrender.com`)
   - **Proxy status**: make sure the little cloud icon is **orange**
     ("Proxied"), not grey ("DNS only"). This matters - Access only
     protects traffic that's proxied through Cloudflare. A grey cloud
     means visitors bypass Cloudflare (and the login gate) entirely.
3. Save.

## Step 6: add the custom domain on your hosting platform

**On Vercel**: Project → Settings → Domains → Add → type `hub.remotebase.com`
→ follow the verification it shows you (it should just work once the CNAME
from Step 5 is live, since it's already pointing at your Vercel URL).

**On Render**: the static site's dashboard → Settings → Custom Domains →
Add Custom Domain → type `hub.remotebase.com` → follow Render's verification
step.

Either way, your host will issue its own TLS certificate for the domain
automatically - no action needed from you there.

At this point, `hub.remotebase.com` should load the hub - still with no
login gate yet. That's expected; that's what the rest of this guide adds.

## Step 7: turn on Zero Trust (first time only)

1. In the Cloudflare dashboard, find **Zero Trust** in the left sidebar
   (sometimes shown as its own separate area you're prompted to set up).
2. The first time you open it, Cloudflare asks you to choose a **team
   name** (e.g. `remotebase`) - this becomes part of your login page's URL
   later. Pick something short and recognizable; you can't easily rename it
   later, so avoid anything you'll regret.
3. Confirm the **Free** plan (covers up to 50 authenticated users - see the
   README for what happens if you outgrow that).

## Step 8: create the Access application

1. In Zero Trust, go to **Access controls → Applications** (older
   Cloudflare accounts may show this as **Access → Applications**).
2. Select **Add an application**.
3. Choose **Self-hosted**.
4. Give it a name (e.g. "Employee Hub").
5. Under **Public hostname**, set:
   - **Domain**: pick `remotebase.com` from the dropdown
   - **Subdomain**: `hub`
   (Together these form `hub.remotebase.com` - it should match Step 5
   exactly.)
6. Continue to the next screen (policies) - see Step 9.

## Step 9: create the policy - the actual three-domain allowlist

This is the step that does the real work.

1. Add a new policy. Name it something like "Allowed company domains."
2. Set **Action** to **Allow**.
3. Under **Include**, add three separate rules, all with the selector
   **Emails ending in**:
   - `remotebase.com`
   - `snapdev.ai`
   - `ember.new`

   (Add each as its own rule row - the policy allows anyone matching *any*
   of them, which is what you want.)
4. Leave **Require** and **Exclude** empty unless you specifically want
   extra restrictions later.
5. Save the policy, then save/deploy the application.

## Step 10: choose the login method

1. Still in Zero Trust, check **Settings → Authentication** (or you may be
   prompted during Step 8-9).
2. **One-Time PIN** is enabled by default on the free plan and needs no
   extra setup - a visitor types their email, gets a 6-digit code by email,
   and enters it. This is the simplest option and is enough on its own.
3. If you'd rather people sign in with their actual Google account (so it
   feels like "log in with Google" instead of typing a code), you can add
   Google as an identity provider under **Settings → Authentication → Login
   methods** - this needs a few extra minutes in Google Cloud Console to
   create OAuth credentials. Not required; One-Time PIN alone is a
   completely valid, secure choice for this use case.

## Step 11: test it

1. Open `hub.remotebase.com` in a private/incognito browser window (so you
   don't accidentally reuse an existing Cloudflare login).
2. You should now see a Cloudflare login screen **before** the hub loads -
   not the hub itself.
3. Enter an email ending in one of the three allowed domains, complete the
   One-Time PIN (or Google login) flow, and confirm you land on the actual
   hub afterward.
4. If you have access to an email address that does **not** end in one of
   the three domains, try that too - it should be refused. This is the
   check that actually proves the restriction works, not just that login
   works.

## Troubleshooting

- **Still no login screen after Step 5-9**: double check the DNS record's
  proxy status is orange/"Proxied," not grey. This is the single most
  common miss.
- **"This hostname is not covered by a certificate" or similar TLS error**:
  give it a few more minutes - certificate issuance on the hosting side
  (Render/Vercel) can lag slightly behind DNS propagation.
- **One-Time PIN email never arrives**: check spam first; Cloudflare's PIN
  emails occasionally land there. If it's consistently missing, Cloudflare's
  community forum has active threads on this - it's a known, if
  intermittent, issue with certain mail providers.
- **You want to change the allowed domains later**: Zero Trust → Access
  controls → Applications → Employee Hub → edit the policy from Step 9.
  Also update `config/allowed-domains.json` in this repo to match, so the
  two stay in sync (that file is documentation only - editing it alone
  changes nothing live).

## If you don't have DNS/registrar access to any of the three domains

Steps 1, 2, 7, 8, 9, and 10 don't need it - you can do all of that ahead of
time. Only Step 3 (changing nameservers) and confirming the DNS record in
Step 5 need registrar access. Get everything else ready, then hand off just
that one step to whoever does have it, with this guide open to Step 3.
