import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { ForgotPasswordDto } from '../../auth/dtos/auth.dto';
import { UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async accountActivation(user: UserDocument, activationCode: string) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: 'override',
      subject: 'Confirm you account',
      template: './activation.template',
      context: {
        name: user.name,
        activationCode,
      },
    });
  }

  async forgotPassword(data: ForgotPasswordDto) {
    // TODO finish it later
  }
}
