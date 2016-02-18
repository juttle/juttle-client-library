import Input from './inputs';
import View from './view';
import JuttleServiceHttp from './utils/http-api';
import Errors from './errors';

export default function Juttle(juttleServiceUrl) {
    this.juttleServiceUrl = juttleServiceUrl;
    this.api = new JuttleServiceHttp(`http://${juttleServiceUrl}`);

    /*
     * Describe the views and inputs for a bundle
     */
    this.describe = (bundle) => {
        return this.api.getInputs(bundle)
        .then(inputs => {
            return { inputs: inputs };
        });
    };

    this.Input = Input.bind(null, this.juttleServiceUrl);
    this.View = View.bind(null, this.juttleServiceUrl);
    this.Errors = Errors;
}
