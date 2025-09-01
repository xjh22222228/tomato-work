import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateUserConfigureDto } from './dto/update-user-configure.dto'
import { UserConfigure } from './entities/user-configure.entity'

@Injectable()
export class UserConfiguresService {
  constructor(
    @InjectRepository(UserConfigure)
    private userConfiguresRepository: Repository<UserConfigure>,
  ) {}

  async findOrCreate(uid: number): Promise<UserConfigure> {
    let userConfigure = await this.userConfiguresRepository.findOne({
      where: { uid },
    })

    if (!userConfigure) {
      userConfigure = this.userConfiguresRepository.create({
        uid,
        isTaskNotify: true,
        isMatterNotify: true,
        serverChanSckey: '',
      })

      await this.userConfiguresRepository.save(userConfigure)
    }

    return userConfigure
  }

  async update(
    uid: number,
    updateUserConfigureDto: UpdateUserConfigureDto,
  ): Promise<UserConfigure> {
    const userConfigure = await this.findOrCreate(uid)
    const updatedUserConfigure = Object.assign(
      userConfigure,
      updateUserConfigureDto,
    )
    return this.userConfiguresRepository.save(updatedUserConfigure)
  }
}
