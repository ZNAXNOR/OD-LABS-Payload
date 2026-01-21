import React from 'react'
import { getTranslation } from '@payloadcms/translations'
import { EntityType, getAccessResults, type PayloadRequest } from 'payload'
import { formatAdminURL } from 'payload/shared'
import { Button, Card, Locked } from '@payloadcms/ui'
import { getGlobalData, getNavGroups, getVisibleEntities } from '@payloadcms/ui/shared'

const baseClass = 'collections'

export async function DashboardCollections({
  req,
  widgetSlug,
}: {
  req: PayloadRequest
  widgetSlug: string
}) {
  const { i18n, payload, user } = req
  const { admin: adminRoute } = payload.config.routes as { admin: string }
  const { t } = i18n

  const permissions = await getAccessResults({ req })
  const visibleEntities = getVisibleEntities({ req })
  const globalData = await getGlobalData(req)
  const allNavGroups = getNavGroups(permissions, visibleEntities, payload.config, i18n)

  let entities: any[] = []
  let displayLabel = ''

  if (widgetSlug === 'infrastructure') {
    displayLabel = 'Infrastructure'
    const allowed = [payload.config.admin.user, 'media', 'forms', 'form-submissions']
    entities = allNavGroups
      .flatMap((g) => g.entities)
      .filter((e) => e.type === EntityType.collection && allowed.includes(e.slug))
  } else if (widgetSlug === 'pages') {
    displayLabel = 'Pages'
    const allowed = ['pages', 'blogs', 'services', 'legal', 'contacts']
    entities = allNavGroups
      .flatMap((g) => g.entities)
      .filter((e) => e.type === EntityType.collection && allowed.includes(e.slug))
  } else if (widgetSlug === 'globals') {
    displayLabel = 'Globals'
    entities = allNavGroups.flatMap((g) => g.entities).filter((e) => e.type === EntityType.global)
  }

  if (entities.length === 0) return null

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__wrap`}>
        <div className={`${baseClass}__group`}>
          <h2 className={`${baseClass}__label`}>{displayLabel}</h2>
          <ul className={`${baseClass}__card-list`}>
            {entities.map((entity, index) => {
              const { slug, type, label } = entity
              const title = getTranslation(label, i18n) as string
              let href = ''
              let createHREF = ''
              let buttonAriaLabel = ''
              let hasCreatePermission = false
              let isLocked = false
              let userEditing: any = null

              if (type === EntityType.collection) {
                buttonAriaLabel = t('general:showAllLabel', { label: title })
                href = formatAdminURL({ adminRoute, path: `/collections/${slug}` })
                createHREF = formatAdminURL({ adminRoute, path: `/collections/${slug}/create` })
                hasCreatePermission = Boolean(permissions?.collections?.[slug]?.create)
              } else {
                buttonAriaLabel = t('general:editLabel', { label: title })
                href = formatAdminURL({ adminRoute, path: `/globals/${slug}` })
                const globalLockData = globalData.find((g) => g.slug === slug)
                if (globalLockData) {
                  isLocked = Boolean(globalLockData.data?._isLocked)
                  userEditing = globalLockData.data?._userEditing
                }
              }

              return (
                <li key={index}>
                  <Card
                    title={title}
                    titleAs="h3"
                    href={href}
                    buttonAriaLabel={buttonAriaLabel}
                    id={`card-${slug}`}
                    actions={
                      isLocked && (user as any)?.id !== userEditing?.id ? (
                        <Locked
                          key="locked"
                          user={userEditing}
                          className={`${baseClass}__locked`}
                        />
                      ) : (
                        hasCreatePermission &&
                        type === EntityType.collection && (
                          <Button
                            key="create"
                            aria-label={t('general:createNewLabel', { label: title })}
                            buttonStyle="icon-label"
                            el="link"
                            icon="plus"
                            iconStyle="with-border"
                            round
                            to={createHREF}
                          />
                        )
                      )
                    }
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
