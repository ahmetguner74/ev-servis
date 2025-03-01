// Prisma client'ı import et
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    const email = "ahmetguner74@gmail.com";
    const password = "Selim-16";
    
    // Emaile sahip kullanıcıyı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Kullanıcı varsa, rolünü güncelle
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          role: "ADMIN",
          password: await bcrypt.hash(password, 12) // Şifreyi güncelle
        }
      });
      console.log(`Kullanıcı yönetici olarak güncellendi: ${updatedUser.email}`);
    } else {
      // Kullanıcı yoksa, yeni admin kullanıcısı oluştur
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const newUser = await prisma.user.create({
        data: {
          email,
          name: "Ahmet Güner",
          password: hashedPassword,
          role: "ADMIN"
        }
      });
      
      console.log(`Yeni yönetici kullanıcısı oluşturuldu: ${newUser.email}`);
    }
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 