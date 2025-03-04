import JSEncrypt from 'jsencrypt'

const PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQk33iNdA8Iey7J6XrBsidqn6u8EDLWPHsfEUgLQ3qiTikhPKDTzZkpAfU/O0x6NvSKa7Dp0+uqWT3vnW1De0+3u8mCYdVfOdH94VG4xg5U5UrRJei8HhPiXuvKQ+6NBtebCCW5adZ4pBgOiU14cJLhVmm+dYiLo3IDD5LqrlomQIDAQAB";

// 加密函数
export function encrypt(txt) {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(PUBLIC_KEY); // 设置公钥
    return encryptor.encrypt(txt); // 对数据进行加密
}
