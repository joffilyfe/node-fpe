const fpe = require('../lib');
const assert = require('assert');
const expect = require('expect.js');

describe('crytography', function() {
  it('should throw a password error', function() {
    expect(fpe).withArgs({}).to.throwException(/`password` is required/);
  });

  it('should throw a password length error', function() {
    expect(fpe).withArgs({password: '123456'}).to.throwException(/`password` must be 16 long/);
  });


  it('should throw a iv error', function() {
    expect(fpe).withArgs({password: 'passwordpassword'}).to.throwException(/`iv` is required/);
  });

  it('should throw a iv length error', function() {
    expect(fpe).withArgs({password: 'passwordpassword', iv: '1'}).to.throwException(/`iv` must be 16 long/);
  });

  it('should encrypt and return to the plain input', function() {
    const cipher = fpe({ password: 'secretsecret1234', iv: 'secretsecret1234' });
    const plainAgain = cipher.decrypt(cipher.encrypt('12345'));
    expect(plainAgain).to.be('12345');
  });

  it('should has a different output with different passwords', function() {
    const cipher1 = fpe({ password: 'secretsecret1234', iv: 'secretsecret1234' });
    const cipher2 = fpe({ password: 'secretsecret1230', iv: 'secretsecret1234' });
    expect(cipher1.encrypt('12345')).to.not.be(cipher2.encrypt('12345'));
  });

  it('should use the ascii domain', function() {
    var ascii = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKL{MNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split(
      ''
    );
    const cipher = fpe({ password: 'secretsecret1234', iv: 'secretsecret1234', domain: ascii });
    expect(cipher.decrypt(cipher.encrypt('ABBA'))).to.be('ABBA');
  });

  it('should throw not in domain exception', function() {
    const domain = ['A', 'B', 'C', 'D', 'E'];
    const cipher = fpe({ password: 'secretsecret1234', iv: 'secretsecret1234', domain: domain});
    expect(cipher.encrypt).withArgs('ABF').to.throwException(/some of the input characters are not in the cipher\'s domain: \[A,B,C,D,E\]/);
  });

  // it('should use a different algorithm', function() {
  //   const cipher = fpe({ password: 'secretsecret1234', iv: 'secretsecret1234', algorithm: 'aes192' });
  //   expect(cipher.decrypt(cipher.encrypt('12345')).to.be('12345'));
  // });

  it('should have an input as string', function() {
    const cipher = fpe({ password: 'secretsecret1234', iv: 'secretsecret1234' });
    expect(cipher.encrypt).withArgs(123).to.throwException(/input is not a string/);
  });
});
