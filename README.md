# XMPP

Displays XMPP view.

Model : bdsft_webrtc.default.xmpp

## Configuration
<a name="configuration"></a>

Property                 |Type     |Default                                                              |Description
-------------------------|---------|---------------------------------------------------------------------|----------------------
enableXMPP           |boolean  |true                                                                 |True if XMPP is enabled
boshURL        		|string  |http://ums.broadsoftlabs.com:5280                    					|URL to connect XMPP over bosh


## Method
<a name="method"></a>

Method   |Parameters  |Description
---------|------------|-----------------------------
requestConfig(xsiUser, xsiPassword)  | xsiUser : string, xsiPassword : string            |Requests the device configuration
