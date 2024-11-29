import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ default: true })
    isActive: boolean = true;

    constructor(partial: Partial<User> = {}) {
        Object.assign(this, partial);
    }
}
