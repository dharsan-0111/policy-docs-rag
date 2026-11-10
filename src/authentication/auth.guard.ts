import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['jwt']; // Read the cookie

        if (!token) {
            throw new UnauthorizedException('Please log in first');
        }

        try {
            // This automatically checks the signature and expiration!
            const decodedPayload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET')
            });

            // Attach the decoded data (like the user ID) to the request
            // so your controllers can use it.
            request['user'] = decodedPayload;

        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }

        return true; // Let the request pass
    }
}