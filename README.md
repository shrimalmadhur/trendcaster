## Development

To install dependency, run:

```bash
yarn
```

To start the project locally, run:

```bash
yarn dev
```

Open `http://localhost:3000` with your browser to see the result.

### Sample data

To seed the data locally, create `.env.local` in your in your root folder and add the following variable
```
NEXT_DEPLOYMENT_ENVIRONMENT = "local"
```
This will load the data from [testdata](./testdata/) folder. Feel free to change the data and test it. This data is similar to what the APIs would return.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information.