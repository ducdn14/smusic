import queryString from 'query-string';

export const sendRequestJS = async (props) => {
    let {
        url,
        method,
        body,
        queyParams = {},
        useCredentials= false,
        headers = {},
        nextOption = {},
    } = props;

    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json', ...headers}),
        body: body ? JSON.stringify(body) : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";
    if (queyParams) {
        url = `${url}?${queryString.stringify(queyParams)}`;
    }
    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json().then(function (json) {
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                }
            })
        }
    })
}