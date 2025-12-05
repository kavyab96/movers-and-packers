import React, { useEffect, useState } from 'react'
import axiosInstance from '@/axios/axiosInstance'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'

const formatCurrency = (value) => {
  if (value == null) return '-'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)
  } catch {
    return value
  }
}

const Earnings = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const fetchPayments = async (page = 1, limit = itemsPerPage) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.get('/provider/get-payments', {
        params: { page, limit }
      })

      const d = res?.data || {}

      // Support multiple response shapes
      const items = d.data || d.payments || []
      const current = d.currentPage || d.current_page || d.page || page
      const pages = d.totalPages || d.total_pages || Math.max(1, Math.ceil((d.total || items.length) / limit))
      const total = d.total ?? d.count ?? items.length

      setPayments(items)
      setCurrentPage(current)
      setTotalPages(pages)
      setTotalCount(total)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments(1, itemsPerPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    fetchPayments(page, itemsPerPage)
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Earnings</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm">Rows:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Booking ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-red-500">{error}</TableCell>
            </TableRow>
          ) : payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No payments found.</TableCell>
            </TableRow>
          ) : (
            payments.map((p) => (
              <TableRow key={p._id || p.id}>
                <TableCell>{new Date(p.payment_date || p.createdAt || p.paymentDate || p.date || p.timestamp).toLocaleString()}</TableCell>
                <TableCell className="font-medium">{p.booking_id || p.bookingId || p.requestId || '-'}</TableCell>
                <TableCell>{formatCurrency(p.amount || p.total || p.payable)}</TableCell>
                <TableCell>{p.payment_method || p.method || '-'}</TableCell>
                <TableCell>
                  <Badge variant={p.payment_status === 'success' || p.status === 'paid' ? 'secondary' : 'outline'}>
                    {p.payment_status || p.status || p.paymentStatus || '-'}
                  </Badge>
                </TableCell>
                <TableCell>{p.notes || p.description || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{`Showing ${payments.length} of ${totalCount} payments`}</div>

          <Pagination className="mt-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink isActive={currentPage === idx + 1} onClick={() => handlePageChange(idx + 1)}>
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default Earnings