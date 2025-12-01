import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const UsersList = () => {
  return (
    <div className="mt-12 w-full">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      {/* <Table >
        <TableCaption>List of users available</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Service Areas</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow key={p._id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.email}</TableCell>
            <TableCell>{p.phone}</TableCell>
          </TableRow>
        </TableBody>
      </Table> */}

    </div>
  )
}

export default UsersList