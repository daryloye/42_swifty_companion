```mermaid

sequenceDiagram
    box Frontend
        participant index
        participant Profile
        participant Friends
    end
    box Backend
        participant 42-API
        participant Cache
    end

    Note over index, Cache: Login flow
    index->>42-API: Request auth code with redirect (/oauth/authorize)
    42-API->>index:
    index->> 42-API: Exchange code for token (/oauth/token)
    42-API->>index:
    index->>Cache: setToken
    
    Note over index, Cache: Logout flow
    index->>Cache: deleteToken

    Note over index, Cache: Profile
    Profile->>Cache: getToken
    Cache->>Profile:
    Profile->>42-API: Fetch User ID (/v2/users?filter[login]={login})
    42-API->>Profile:
    Profile->>42-API: Fetch User Details (/v2/users/{id})
    42-API->>Profile:

    Note over index, Cache: Friends

    Note over Friends, Cache: Add new friend
    Friends->>Cache: getToken
    Cache->>Friends:
    Friends->>42-API: Fetch User ID (/v2/users?filter[login]={login})
    42-API->>Friends:
    Friends->>Cache: addFriendId

    Note over Friends, Cache: Delete friend
    Friends->>Cache: deleteFriendId

    Note over Friends, Cache: Show friends
    Friends->>Cache: getToken
    Cache->>Friends:
    Friends->>Cache: getFriendId
    Cache->>Friends:
    Friends->>42-API: Fetch User Details (/v2/users/{id})
    42-API->>Friends: