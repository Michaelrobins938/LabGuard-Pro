declare module 'twilio' {
  import { EventEmitter } from 'events'
  export interface TwilioClient {
    messages: {
      create(options: { body: string; from: string; to: string }): Promise<any>
    }
  }
  function twilio(accountSid: string, authToken: string): TwilioClient & EventEmitter
  export = twilio
}