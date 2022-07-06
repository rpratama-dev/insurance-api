class PhoneNumber {
  #phone: string;
  #newPhone: string;

  constructor(phone?: string | number) {
    this.#phone = (phone || '').toString();
    this.#newPhone = '';
  }

  public set phone(number: string | number) {
    this.#phone = number.toString();
  }

  public get newPhone() {
    return this.#newPhone;
  }

  public parse(ph?: number | string): string | null {
    if (!ph || String(ph).length < 7) return null;

    let phone = ph ? String(ph).trim() : this.#phone;
    if (phone.startsWith('+62')) {
      phone = `0${phone.slice(3)}`;
    } else if (phone.startsWith('62')) {
      phone = `0${phone.slice(2)}`;
    } else if (phone.startsWith('8')) {
      phone = `0${phone}`;
    }
    this.#newPhone = phone.replace(/[- .]/g, '');

    return phone;
  }

  private validatePrefix(phone: string) {
    const prefix = phone.slice(0, 4);
    if (['0831', '0832', '0833', '0838'].includes(prefix)) return 'axis';
    if (['0895', '0896', '0897', '0898', '0899'].includes(prefix)) return 'three';
    if (['0817', '0818', '0819', '0859', '0877', '0878'].includes(prefix)) return 'xl';
    if (['0814', '0815', '0816', '0855', '0856', '0857', '0858'].includes(prefix)) return 'indosat';
    if (['0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853'].includes(prefix)) return 'telkomsel';
    if (['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'].includes(prefix)) return 'smartfren';
    return null;
  }

  public test() {
    if (!this.#newPhone || !/^08[1-9][0-9]{7,10}$/.test(this.#newPhone)) {
      return false;
    }
    return true;
  }

  public validate(ph?: string | number) {
    const newPhone = this.parse(ph || this.#phone);
    if (newPhone && this.validatePrefix(newPhone)) {
      return this.test();
    }
    return false;
  }
}

export default PhoneNumber;

// const phoneNumber = new PhoneNumber('085255041411')
// console.log(phoneNumber.validate())
// phoneNumber.phone = '85255041411'
// console.log(phoneNumber.validate())
// phoneNumber.phone = '6285255041411'
// console.log(phoneNumber.validate())
// phoneNumber.phone = '+6285255041411'
// console.log(phoneNumber.validate())
