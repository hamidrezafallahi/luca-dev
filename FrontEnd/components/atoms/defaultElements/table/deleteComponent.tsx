"use client";

import React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useGetConditionallyMutation } from '@services/base';

import { TrashbinIcon } from '../../iconComponents';

function DeleteComponent({ ...props }: { id: string }) {
  const { id } = props;
  const params = useParams()!;
  const router = useRouter();
  const [deleteRecord, { isLoading }] = useGetConditionallyMutation();
  const handleDeleteRecord = async () => {
    const deleteRes = await deleteRecord({
      url: `/${params.field}/${id}`,
      method: 'DELETE',
    });

    if ('data' in deleteRes && deleteRes.data?.isSuccess) router.refresh();
  };
  return (
    <button
      disabled={isLoading}
      onClick={handleDeleteRecord}
      className="admin-icon-btn admin-icon-btn-danger"
      aria-label="delete"
      type="button"
    >
      <TrashbinIcon config={{ stroke: 'var(--error-color)' }} />
    </button>
  );
}

export default DeleteComponent;
