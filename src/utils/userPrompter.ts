import * as readline from 'readline';

export class UserPrompter {
  static prompt(query: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise<string>((resolve: (value: string) => void) => rl.question(query, (ans: string) => {
      rl.close();
      resolve(ans);
    }));
  }

  static promptPassword(query: string): Promise<string> {
    process.stdout.write(query);

    const rl: readline.Interface = readline.createInterface({
      input: process.stdin,
      output: new (require('stream').Writable)({
        write: (chunk: any, encoding: string, callback: () => void) => {
          process.stdout.write("*");
          callback();
        }
      }),
      terminal: true
    });

    return new Promise<string>((resolve) => rl.question('', (ans: string) => {
      rl.close();
      console.log();
      resolve(ans);
    }));
  }
}