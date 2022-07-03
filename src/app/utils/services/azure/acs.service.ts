import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ACSService {

    identityClient: CommunicationIdentityClient;
    connectionString: any;

    constructor(private http: HttpClient) {
        this.connectionString = environment.acs_connection_string;
        
        // Instantiate the identity client
        this.identityClient = new CommunicationIdentityClient(this.connectionString);
    }

    async generateToken() {
        // Issue an identity and an access token with the "voip" scope for the new identity

        let identityTokenResponse = await this.identityClient.createUserAndToken(["voip"]);

        const { token, expiresOn, user } = identityTokenResponse;
        // console.log(`\nCreated an identity with ID: ${user.communicationUserId}`);
        // console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
        return { token, expiresOn, user };
    }

    async createRandomUser() {
        // Instantiate the identity client
        const identityClient = new CommunicationIdentityClient(this.connectionString);
        // console.log(this.connectionString);
        // Issue an identity and an access token with the "voip" scope for the new identity
        let identityTokenResponse = await this.identityClient.createUserAndToken(["voip"]);
        const { token, expiresOn, user } = identityTokenResponse;
        // console.log(`\nCreated an identity with ID: ${user.communicationUserId}`);
        // console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
        return user.communicationUserId;
    }

    async generateTokenByUserId(comUserId) {
        return this.identityClient.getToken(comUserId, ["voip"]);
    }

    async generateUser(): Promise<CommunicationUserIdentifier> {
        return this.identityClient.createUser();
    }
}
