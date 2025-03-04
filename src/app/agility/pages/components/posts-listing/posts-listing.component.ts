import { Component, Input, OnInit, TransferState, makeStateKey } from '@angular/core';
import { AgilityService } from '../../../agility.service';
import { htmlDecode } from 'js-htmlencode';
import { firstValueFrom } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';

const POSTS_KEY = makeStateKey<any[]>('posts');

@Component({
  selector: 'app-module-posts-listing',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './posts-listing.component.html',
})
export class ModulePostsListingComponent implements OnInit {
  @Input() data: any;

  public posts: any[] = [];
  public moduleData: any = null;

  constructor(
    private agilityService: AgilityService,
    private transferState: TransferState
  ) {}

  async ngOnInit(): Promise<void> {
    this.moduleData = this.data.item.fields;

    // Check if the posts data is already available in the transfer state
    this.posts = this.transferState.get(POSTS_KEY, null as any);

    if (!this.posts) {
      const postsRes = await firstValueFrom(this.agilityService.getContentList('posts'));

      this.posts = postsRes.items.map((p: any) => {
        return {
          title: p.fields.title,
          slug: p.fields.slug,
          date: new Date(p.fields.date).toLocaleDateString(),
          image: p.fields.image,
          content: p.fields.content,
          category: p.fields.category.fields.title || 'Uncategorized',
        };
      });

      // Store the posts data in the transfer state
      this.transferState.set(POSTS_KEY, this.posts);
    }
  }
}
