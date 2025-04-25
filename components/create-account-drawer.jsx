"use client";

import React from 'react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '@/app/lib/schema';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';


const CreateAccountDrawer = ({children}) => {
    const [open, setOpen] = useState(false);

    const {register, 
      handleSubmit, 
      formState:{errors},
      setValue,
      watch,
      reset,
    } = useForm({
      resolver:zodResolver(accountSchema),
      defaultValues: {
        name: "",
        type: "CURRENT",
        balance: "",
        isDefault: false,
      },
    });


  return (
    <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger  asChild>{children}</DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
            <DrawerTitle>Create New Account</DrawerTitle>
            </DrawerHeader>
            <div className='px-4 pb-4'>
                <form className='space-y-4'>
                  <div className='space-y-2'>
                    <label htmlFor="name" className='text-sm font-kedium'>Account Name</label>
                    <Input 
                    id="name" placeholder="e.g., Main Checking"
                    {...register("name")}
                    />
                    {errors.name &&(
                      <p className='text-sm text-red-500'>{errors.name.message}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label htmlFor="type" className='text-sm font-kedium'>Account Type</label>
                    <Select onValueChange={(value) => setValue("type", value)} defaultValues={watch("type")}
                    >
                    <SelectTrigger className="type">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CURRENT">Current</SelectItem>
                        <SelectItem value="SAVINGs">Savings</SelectItem>
                
                      </SelectContent>
                    </Select>

                    {errors.type &&(
                      <p className='text-sm text-red-500'>{errors.type.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label htmlFor="balance" className='text-sm font-kedium'>Initial Balance</label>
                    <Input 
                    id="balance"
                    type="number"
                    step="0.01"
                    placeholder="0.00" 
                    {...register("balance")}
                    />
                    {errors.balance &&(
                      <p className='text-sm text-red-500'>{errors.balance.message}</p>
                    )}
                  </div>
                  
                  
                  


                </form>
            </div>
        </DrawerContent>
    </Drawer>

  )
}

export default CreateAccountDrawer;
