const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.familyMember.deleteMany();

  // Generation 0 - Grandparents
  const grandfather = await prisma.familyMember.create({
    data: {
      name: 'Nguyen Van Xuan',
      relationship: 'Grandfather',
      generation: 0,
      birthDate: new Date('1940-03-15'),
      address: '123 Hoang Hoa Tham, Hanoi, Vietnam',
      latitude: 21.0419,
      longitude: 105.8176,
      phone: '+84 123 456 789',
      bio: 'Family patriarch, retired teacher',
    }
  });

  const grandmother = await prisma.familyMember.create({
    data: {
      name: 'Tran Thi Mai',
      relationship: 'Grandmother',
      generation: 0,
      birthDate: new Date('1942-07-22'),
      address: '123 Hoang Hoa Tham, Hanoi, Vietnam',
      latitude: 21.0419,
      longitude: 105.8176,
      phone: '+84 123 456 790',
      bio: 'Family matriarch, loves cooking traditional dishes',
    }
  });

  // Generation 1 - Parents/Uncles/Aunts
  const father = await prisma.familyMember.create({
    data: {
      name: 'Nguyen Van Minh',
      relationship: 'Father',
      generation: 1,
      parentId: grandfather.id,
      birthDate: new Date('1965-11-08'),
      address: '45 Le Duan, Ho Chi Minh City, Vietnam',
      latitude: 10.7769,
      longitude: 106.7009,
      phone: '+84 987 654 321',
      email: 'minh.nguyen@email.com',
      bio: 'Engineer, eldest son',
    }
  });

  const mother = await prisma.familyMember.create({
    data: {
      name: 'Le Thi Huong',
      relationship: 'Mother',
      generation: 1,
      birthDate: new Date('1968-04-12'),
      address: '45 Le Duan, Ho Chi Minh City, Vietnam',
      latitude: 10.7769,
      longitude: 106.7009,
      phone: '+84 987 654 322',
      email: 'huong.le@email.com',
      bio: 'Doctor at local hospital',
    }
  });

  const uncle = await prisma.familyMember.create({
    data: {
      name: 'Nguyen Van Hung',
      relationship: 'Uncle',
      generation: 1,
      parentId: grandfather.id,
      birthDate: new Date('1970-02-28'),
      address: '78 Nguyen Trai, Da Nang, Vietnam',
      latitude: 16.0544,
      longitude: 108.2022,
      phone: '+84 912 345 678',
      bio: 'Business owner, second son',
    }
  });

  const aunt = await prisma.familyMember.create({
    data: {
      name: 'Nguyen Thi Lan',
      relationship: 'Aunt',
      generation: 1,
      parentId: grandfather.id,
      birthDate: new Date('1972-09-05'),
      address: '200 Tran Hung Dao, Hue, Vietnam',
      latitude: 16.4637,
      longitude: 107.5909,
      phone: '+84 923 456 789',
      bio: 'University professor',
    }
  });

  // Generation 2 - Children/Cousins
  await prisma.familyMember.create({
    data: {
      name: 'Nguyen Minh Tuan',
      relationship: 'Son',
      generation: 2,
      parentId: father.id,
      birthDate: new Date('1992-06-18'),
      address: '45 Le Duan, Ho Chi Minh City, Vietnam',
      latitude: 10.7769,
      longitude: 106.7009,
      phone: '+84 933 111 222',
      email: 'tuan.nguyen@email.com',
      bio: 'Software developer',
    }
  });

  await prisma.familyMember.create({
    data: {
      name: 'Nguyen Minh Ha',
      relationship: 'Daughter',
      generation: 2,
      parentId: father.id,
      birthDate: new Date('1995-12-03'),
      address: '88 Pasteur, Ho Chi Minh City, Vietnam',
      latitude: 10.7831,
      longitude: 106.6957,
      phone: '+84 944 222 333',
      email: 'ha.nguyen@email.com',
      bio: 'Marketing manager',
    }
  });

  await prisma.familyMember.create({
    data: {
      name: 'Nguyen Hung Duc',
      relationship: 'Cousin',
      generation: 2,
      parentId: uncle.id,
      birthDate: new Date('1997-08-20'),
      address: '78 Nguyen Trai, Da Nang, Vietnam',
      latitude: 16.0544,
      longitude: 108.2022,
      phone: '+84 955 333 444',
      bio: 'Medical student',
    }
  });

  await prisma.familyMember.create({
    data: {
      name: 'Nguyen Lan Anh',
      relationship: 'Cousin',
      generation: 2,
      parentId: aunt.id,
      birthDate: new Date('1999-01-15'),
      address: '200 Tran Hung Dao, Hue, Vietnam',
      latitude: 16.4637,
      longitude: 107.5909,
      email: 'anh.nguyen@email.com',
      bio: 'Art student',
    }
  });

  console.log('Sample family members added successfully!');
  console.log('Added 10 family members across 3 generations');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
