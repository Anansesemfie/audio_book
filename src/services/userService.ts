import Repo from "../db/repository/userRepository";
import { UserType, userReturn } from "../dto/userDTO";

import HELPERS from "../utils/helpers";
import bcrypt from "bcrypt";

import Session from "./sessionService";

class UserService {
  
  private logInfo: string = "";

  public async create(user: UserType): Promise<UserType> {
    try {
      return await Repo.create(user);
    } catch (error: any) {
      this.logInfo = `${HELPERS.loggerInfo.error} creating ${
        user.username
      } @ ${HELPERS.currentTime()}`;
      throw new Error(error);
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async login(user: { email: string; password: string }): Promise<any> {
    try {
      const fetchedUser = await Repo.fetchOne(user);
      this.logInfo = `${HELPERS.loggerInfo.success} logging in ${
        user.email
      } @ ${HELPERS.currentTime()}`;
      if (await bcrypt.compare(user?.password, fetchedUser.password)) {
        return await this.formatForReturn(fetchedUser);
      }
    } catch (error: any) {
      this.logInfo = `${HELPERS.loggerInfo.error} logging in ${
        user.email
      } @ ${HELPERS.currentTime()}`;
      throw new Error(error);
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async logout(sessionId: string): Promise<string> {
    try {
      const session = await Session.endSession(sessionId);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } ended session: ${sessionId} @ ${HELPERS.currentTime()}`;
      return session;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } ended session: ${sessionId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
  public async fetchUser(userId: string) {
    try {
      const fetchedUser = await Repo.fetchUser(userId);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching user ${userId} @ ${HELPERS.currentTime()}`;
      return fetchedUser;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching user ${userId} @ ${HELPERS.currentTime()}`;
      throw new Error(error);
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  private async formatForReturn(user: UserType): Promise<userReturn> {
    try {
      const token = await Session.create(user?._id as string);
      return {
        email: user.email,
        username: user.username,
        dp: user.dp,
        bio: user.bio,
        token: await HELPERS.ENCODE_Token(token?._id),
        subscription: {
          active: !!user.subscription,
          id: user.subscription ? user.subscription.toString() : "",
        },
      };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const userId = await Session.validateResetToken(token);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await Repo.updatePassword(userId, hashedPassword);
    } catch (error:any) {
      throw new Error(error);
    }
  }


  public async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await Repo.fetchOneByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      const token = await this.generatePasswordResetToken(user.email);
      await this.sendPasswordResetEmail(user.email, token);
    } catch (error:any) {
      throw new Error(error);
    }
  }

  private async generatePasswordResetToken(email: string): Promise<string> {
    // Generate a unique token (you can use libraries like crypto or uuid)
    const token = this.generateUniqueToken();
    // await storeTokenInDatabase(email, token);

    return token;
  }

 private  generateUniqueToken(): string {
    // Generate a random string
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return randomString + timestamp;
  }

  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // Send an email to the user containing a link with the password reset token embedded
    // await sendEmail(email, `Password Reset Link: https://anansesemfie.com/reset-password?token=${token}`);
  }

}

export default new UserService();