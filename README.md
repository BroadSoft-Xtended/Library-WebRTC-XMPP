# XMPP

Displays XMPP view.

Namespace : bdsft_webrtc.default.xmpp

## Configuration
<a name="configuration"></a>

Property                 |Type     |Default                                                              |Description
-------------------------|---------|---------------------------------------------------------------------|----------------------
enableXMPP           |boolean  |false                                                                 |True if XMPP is enabled
boshURL        		|string  |https://ums.broadsoftlabs.com:5281                    					|URL to connect XMPP over bosh
removeContactFailed |string  |Could not Remove Contact 													|Message to display when removing contact failed

### xmpp

#### Properties
<a name="xmpp_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
connected 	  |boolean |True if the XMPP service is connected.
connecting	  |boolean |True if the XMPP service is connecting.
disconnecting |boolean |True if the XMPP service is disconnecting.

#### Method
<a name="xmpp_method"></a>

Method   |Parameters  |Description
---------|------------|-----------------------------
connect(jid, password)  | jid : string, password : string            |Connects the XMPP service
disconnect()  |             |Disconnects the XMPP service

### xmppview

#### Elements
<a name="xmppview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
name    |input  |Inputs the name for login.
password|input  |Inputs the password for login.
login   |button  |Button to login.
chatsHolder|div  |Holds the chats view.
subscriptionsHolder|div  |Holds the subscriptions view.
contactsHolder|div  |Holds the contacts view.

### subscriptions

#### Properties
<a name="subscriptions_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
items 	  |object |Subscriptions by their contact id
hasSubscriptions	  |boolean |True if subscriptions exists.


### subscriptionsview

#### Elements
<a name="subscriptionsview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
subscriptionsContent|div  |Holds the subscription views.

### subscription

#### Properties
<a name="subscription_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
id 	  		  |string  |JID of the contact that sent the subscription.
name		  |string |Name of the contact that sent the subscription.
accepted	  |boolean |True if the subscriptions was accepted.
denied	  |boolean |True if the subscriptions was denied.


### subscriptionview

#### Elements
<a name="subscriptionview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
name|div  |Displays the name of the contact that requests a subscription.
accept|button  |Accepts the subscription.
deny|button  |Denies the subscription.

### mycontact

#### Properties
<a name="mycontact_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
id 	  		  |string  |JID of the logged in user.
name		  |string |Name of the logged in user.
presence	  |string |Presence of the logged in user.
presenceSelect|boolean |Value of presence select.

#### Method
<a name="mycontact_method"></a>

Method   |Parameters  |Description
---------|------------|-----------------------------
sendPresence(presence)  | presence : string            |Update the presence status of the logged in user.


### mycontactview

#### Elements
<a name="mycontactview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
name|div  |Displays the name of the logged in user.
presenceSelect|select  |Changes the presence status of the logged in user.

### message

#### Properties
<a name="message_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
body	  |string |Body of the message.
chatState|string |Chat state.
direction|incoming or outgoing |Direction of the message.
from		  |string |JID of the sender of the message.
time|date |Date when the message was received or sent.
to 	  		  |string  |JID of the receipient of the message.

### messageview

#### Elements
<a name="messageview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
body|div  |Displays the text of the message.

### handle

#### Method
<a name="handle_method"></a>

Method   |Parameters  |Description
---------|------------|-----------------------------
toggle()  | |Toggles the visibility of the xmpp view.

### contacts

#### Properties
<a name="contacts_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
items	  |object |Contacts by their contact id.

### contactsview

#### Elements
<a name="contactsview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
addContactHolder|div  |Holds the Add Contact view.
contactsContent|div  |Holds the contact views.
myContactHolder|div  |Holds the My Contact view.
removeContactFailed|div  |Displays the message if removing the contact failed.

### contact

#### Properties
<a name="contact_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
id	  |string |JID of the contact.
messages	  |array |Messages from or to the contact.
name	  |string |Name of the contact.
presence	  |string |Presence of the contact.
selected	  |string |True if the contact is selected.
subscription	  |string |Subscription status of the contact.

#### Method
<a name="contact_method"></a>

Method   |Parameters  |Description
---------|------------|-----------------------------
addMessage(message)  | message : message |Adds a message to the contact.
select()  | |Selects the contact.
deselect()  | |Deselects the contact.
available()  | |Sets the contact presence to available.
unavailable()  | |Sets the contact presence to unavailable.
remove()  | |Removes the contact from the roster and unsubscribes from it.
close()  | |Deselects the contact and emits the closeContact event.

### contactview

#### Elements
<a name="contactview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
name|div  |Displays the name of the contact.
remove|button  |Removes the contact.
close|button  |Deselects the contact.

### chattab

#### Properties
<a name="chattab_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
contacts	  |object  |Contacts by their contact id.


### chattabview

#### Elements
<a name="chattabview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
chatTabContent|div  |Holds the contact views in the tab.


### chats

#### Properties
<a name="chats_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
items	  |object  |Chats by their contact id.
contactSelected	  |boolean  |True if a contact is selected.


### chatsview

#### Elements
<a name="chatsview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
chatsContent|div  |Holds the Chat views.
chatTabHolder|div  |Holds the Chat Tab view.

### chat

#### Properties
<a name="chat_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
input	  |string  |Text that is being typed and to be sent to the contact.
messages	  |array  |Messages sent or received to the contact.
name	  |string  |Name of the contact that is being chated to.
selected	  |boolean  |True if the contact is selected.

#### Method
<a name="chat_method"></a>

Method   |Parameters  |Description
---------|------------|-----------------------------
sendMessage(msg)  | msg : string |Sends a message to the contact.

### chatview

#### Elements
<a name="chatview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
messagesContent|div  |Holds the Message views.
input|textarea  |Text that is being typed.
name|div  |Name of the contact.

### addcontact

#### Properties
<a name="addcontact_properties"></a>

Property      |Type    |Description
--------------|--------|---------------------------------------------------------------------------------
name	  |string  |Name of the contact that should be added.
jid	  |string  |JID of the contact that should be added.
visible	  |boolean  |True if the Add Contact view should be visible.

#### Method
<a name="chat_method"></a>

Method   |Parameters  |Description
---------|------------|-----------------------------
cancel()  |  |Hides the Add Contact view.
show()  |  |Shows the Add Contact view and resets the jid and name input.
add()  |  |Adds the contact using the jid and name input and hides the Add Contact view.

### addcontactview

#### Elements
<a name="addcontactview_elements"></a>

Element  |Type   |Description
---------|-------|----------------------------
name|input  |Name of the contact that should be added.
jid|input  |JID of the contact that should be added.
add|button  |Adds the contact.
addLink|a  |Shows the Add Contact form.
cancelLink|button  |Hides the Add Contact form.

