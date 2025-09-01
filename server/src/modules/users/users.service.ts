import { Injectable, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查用户名或UID是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: [{ username: createUserDto.username }, { uid: createUserDto.uid }],
    })

    if (existingUser) {
      throw new ConflictException('用户名或用户ID已存在')
    }

    // 创建新用户
    const newUser = this.usersRepository.create({
      ...createUserDto,
    })

    return this.usersRepository.save(newUser)
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async findOne(uid: number): Promise<User | null> {
    const numericUid = typeof uid === 'string' ? Number(uid) : uid
    const user = await this.usersRepository.findOne({
      where: { uid: numericUid },
    })
    return user
  }

  async findByLoginName(loginName: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { loginName } })
    return user || null
  }

  /**
   * 通过登录名和密码查找用户
   * @param loginName 登录名
   * @param password 密码（前端已加密）
   * @returns 用户信息或 null
   */
  async findByLoginNameAndPassword(
    loginName: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        loginName,
        password,
      },
    })
    return user || null
  }

  /**
   * 通过 token 查找用户
   * @param token 用户 token
   * @returns 用户信息或 null
   */
  async findByToken(token: string): Promise<User | null> {
    if (!token) return null
    const user = await this.usersRepository.findOne({ where: { token } })
    return user || null
  }

  async update(
    uid: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    await this.usersRepository.update({ uid }, updateUserDto)
    return this.findOne(uid)
  }
}
