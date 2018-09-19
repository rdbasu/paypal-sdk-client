import { getScript, inlineMemoize } from 'belter/src';

import { SDK_SETTINGS } from './constants';
import { getHost, getPath, getDefaultStageHost } from './globals';

export function getSDKScript() {
    return inlineMemoize(getSDKScript, function () {
        var _host$path = { host: getHost(), path: getPath() },
            host = _host$path.host,
            path = _host$path.path;

        var script = getScript({ host: host, path: path });

        if (!script) {
            throw new Error('PayPal Payments SDK script not present on page! Excected to find <script src="https://' + host + path + '">');
        }

        return script;
    });
}

export function getSDKSettings() {
    return inlineMemoize(getSDKSettings, function () {
        var sdkScript = getSDKScript();

        return {
            clientToken: sdkScript.getAttribute(SDK_SETTINGS.CLIENT_TOKEN),
            partnerAttributionID: sdkScript.getAttribute(SDK_SETTINGS.PARTNER_ATTRIBUTION_ID),
            stageHost: sdkScript.getAttribute(SDK_SETTINGS.STAGE_HOST),
            apiStageHost: sdkScript.getAttribute(SDK_SETTINGS.API_STAGE_HOST)
        };
    });
}

export function getClientToken() {
    var _getSDKSettings = getSDKSettings(),
        clientToken = _getSDKSettings.clientToken;

    if (!clientToken) {
        throw new Error('Expected data-client-token="xyz" to be passed with client token, to ' + getSDKScript().outerHTML);
    }

    return clientToken;
}

export function getPartnerAttributionID() {
    return getSDKSettings().partnerAttributionID;
}

export function getStageHost() {
    return getSDKSettings().stageHost || getDefaultStageHost();
}

export function getAPIStageHost() {
    return getSDKSettings().apiStageHost || getStageHost();
}