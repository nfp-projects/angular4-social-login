import { BaseLoginProvider } from "../entities/base-login-provider";
import { SocialUser } from "../entities/user";

declare let FB: any;

export class FacebookLoginProvider extends BaseLoginProvider {

  public static readonly PROVIDER_ID: string = "FACEBOOK";

  constructor(private clientId: string) { super(); }

  initialize(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      this.loadScript(FacebookLoginProvider.PROVIDER_ID,
        "//connect.facebook.net/en_US/sdk.js",
        () => {
          FB.init({
            appId: this.clientId,
            autoLogAppEvents: true,
            cookie: true,
            xfbml: true,
            version: 'v2.9'
          });
          FB.AppEvents.logPageView();

          // FB.getLoginStatus(function (response: any) {
          //   if (response.status === 'connected') {
          //     FB.api('/me?fields=name,email,picture,first_name,last_name', (response: any) => {
          //       let user: SocialUser = new SocialUser();
          //       let authObject = FB.getAuthResponse(); 
          //       user.id = response.id;
          //       user.name = response.name;
          //       user.email = response.email;
          //       user.photoUrl = "https://graph.facebook.com/" + response.id + "/picture?type=normal";
          //       user.firstName = response.first_name;
          //       user.lastName = response.last_name;
          //       user.authToken = authObject;
          //       if (user.authToken!=undefined)
          //       {
          //       resolve(user);
          //       }
          //     });
          //   }
          // });
        });
    });
  }

  signIn(): Promise<SocialUser> {

    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          FB.api('/me?fields=name,email,picture,first_name,last_name', (response: any) => {

            let authObject = FB.getAuthResponse(); 
            let user: SocialUser = new SocialUser();
            user.id = response.id;
            user.name = response.name;
            user.email = response.email;
            user.photoUrl = "https://graph.facebook.com/" + response.id + "/picture?type=normal";
            user.firstName = response.first_name;
            user.lastName = response.last_name;
            user.authToken = authObject;
            

            resolve(user);
          });
        }
      }, { scope: 'email,public_profile' });
    });
  }

  signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.logout((response: any) => {
        resolve();
      });
    });
  }

}
