# Seaport Client Monitor

This is a side project built to surface/summarize Clockify data on hours usage for clients/projects. It is built in React on NextJS.

* Authentication through [Clerk](https://clerk.com)
* Charts built with [Recharts](https://recharts.org)
* Components from [Material-Tailwind](https://material-tailwind.com) and styled with [TailwindCSS](https://tailwindcss.com/)
* Automatic deployments through [Vercel](https://vercel.com)

## Contributing 

Contributions to improve this project are welcome.

## Running locally in development mode

To get started, just clone the repository and run `npm install && npm run dev`:

    git clone git@github.com:mselchow/seaport-client-monitor.git
    npm install
    npm run dev

## Configuring

To build locally, copy `.env` to `.env.local` and paste it in the requisite keys from Clerk and your Clockify workspace. This app was customized based on our Clockify configuration, so you will likely need to adjust the data model in `clockifyProject.js`.

## License

This code is released under the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html). 
