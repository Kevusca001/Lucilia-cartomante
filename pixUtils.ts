
/**
 * Utilitário para geração de payload PIX Estático (Padrão EMV QRCPS / BR Code)
 * Refinado conforme especificações de compatibilidade bancária.
 */

export class PixPayload {
  private key: string;
  private name: string;
  private city: string;
  private transactionId: string;
  private amount: string | null;

  private readonly ID_PAYLOAD_FORMAT_INDICATOR = '00';
  private readonly ID_MERCHANT_ACCOUNT_INFORMATION = '26';
  private readonly ID_MERCHANT_ACCOUNT_INFORMATION_GUI = '00';
  private readonly ID_MERCHANT_ACCOUNT_INFORMATION_KEY = '01';
  private readonly ID_MERCHANT_CATEGORY_CODE = '52';
  private readonly ID_TRANSACTION_CURRENCY = '53';
  private readonly ID_TRANSACTION_AMOUNT = '54';
  private readonly ID_COUNTRY_CODE = '58';
  private readonly ID_MERCHANT_NAME = '59';
  private readonly ID_MERCHANT_CITY = '60';
  private readonly ID_ADDITIONAL_DATA_FIELD_TEMPLATE = '62';
  private readonly ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = '05';
  private readonly ID_CRC16 = '63';

  constructor(key: string, name: string, city: string, transactionId: string = '***', amount: string | number | null = null) {
    this.key = key.replace(/[^\d]/g, ''); // Garante chave limpa (apenas números para CNPJ/CPF/Telefone)
    this.name = name;
    this.city = city;
    this.transactionId = transactionId || '***';
    
    if (typeof amount === 'string') {
      const numeric = amount.replace(/[^0-9,.]/g, '').replace(',', '.');
      this.amount = parseFloat(numeric).toFixed(2);
    } else if (typeof amount === 'number') {
      this.amount = amount.toFixed(2);
    } else {
      this.amount = null;
    }
  }

  private _getValue(id: string, value: string): string {
    const size = String(value.length).padStart(2, '0');
    return id + size + value;
  }

  private _getMerchantAccountInfo(): string {
    const gui = this._getValue(this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI, 'br.gov.bcb.pix');
    const key = this._getValue(this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY, this.key);
    return this._getValue(this.ID_MERCHANT_ACCOUNT_INFORMATION, gui + key);
  }

  private _getCRC16(payload: string): string {
    const payloadWithId = payload + this.ID_CRC16 + '04';
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < payloadWithId.length; i++) {
      crc ^= payloadWithId.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ polynomial) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    return payloadWithId + (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }

  public generate(): string {
    let payload = this._getValue(this.ID_PAYLOAD_FORMAT_INDICATOR, '01');
    payload += this._getMerchantAccountInfo();
    payload += this._getValue(this.ID_MERCHANT_CATEGORY_CODE, '0000');
    payload += this._getValue(this.ID_TRANSACTION_CURRENCY, '986'); // BRL
    
    if (this.amount) {
      payload += this._getValue(this.ID_TRANSACTION_AMOUNT, this.amount);
    }
    
    payload += this._getValue(this.ID_COUNTRY_CODE, 'BR');
    payload += this._getValue(this.ID_MERCHANT_NAME, this.name.substring(0, 25)); // Max 25 chars
    payload += this._getValue(this.ID_MERCHANT_CITY, this.city.substring(0, 15)); // Max 15 chars

    const txid = this._getValue(this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID, this.transactionId);
    payload += this._getValue(this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);

    return this._getCRC16(payload);
  }
}
