import { Injectable } from '@nestjs/common';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashService {
  saltRound: number;
  algo: string;
  key: string;

  constructor(private configService: ConfigService) {
    this.saltRound = 12;
    this.algo = 'aes-256-cbc';
    this.key = this.configService.get<string>('CIPHER_KEY');
  }

  encrypt(data: string) {
    const iv = randomBytes(16); // Génère un vecteur d'initialisation aléatoire
    const cipher = createCipheriv(this.algo, this.key, iv); // Crée un chiffreur avec l'algorithme AES-256-CBC
    let encrypted = cipher.update(data, 'utf8', 'hex'); // Chiffre la chaîne
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted; // Retourne le vecteur d'initialisation et la chaîne chiffrée
  }

  decrypt(data: string) {
    const iv = Buffer.from(data.slice(0, 32), 'hex'); // Récupère le vecteur d'initialisation depuis le début de la chaîne chiffrée
    const encryptedText = data.slice(32); // Récupère la chaîne chiffrée à partir du 32ème caractère
    const decipher = createDecipheriv(this.algo, this.key, iv); // Crée un déchiffreur avec l'algorithme AES-256-CBC
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8'); // Déchiffre la chaîne
    decrypted += decipher.final('utf8');
    return decrypted; // Retourne la chaîne déchiffrée
  }

  encodeData(data: string) {
    return bcrypt.hash(data, 10);
  }

  encodePassword(password: string) {
    const salt = bcrypt.genSaltSync(this.saltRound);
    return bcrypt.hashSync(password, salt);
  }

  comparePasswords(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
