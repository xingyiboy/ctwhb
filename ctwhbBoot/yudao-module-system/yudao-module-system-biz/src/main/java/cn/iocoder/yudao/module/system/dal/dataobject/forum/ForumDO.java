package cn.iocoder.yudao.module.system.dal.dataobject.forum;

import com.sun.xml.bind.v2.TODO;
import lombok.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.LocalDateTime;
import com.baomidou.mybatisplus.annotation.*;
import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;

/**
 * 论坛 DO
 *
 * @author 芋道源码
 */
@TableName("system_forum")
@KeySequence("system_forum_seq") // 用于 Oracle、PostgreSQL、Kingbase、DB2、H2 数据库的主键自增。如果是 MySQL 等数据库，可不写。
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForumDO extends BaseDO {

    /**
     * 用户ID
     */
    @TableId
    private Long id;
    /**
     * 首页图片
     */
    private String picture;
    /**
     * 首页标题
     */
    private String title;
    /**
     * 内容
     */
    private String content;
    /**
     * 简介
     */
    private String introduce;
    /**
     * 用户编号
     */
    private Long userId;
    /**
     * 分类
     *
     * 枚举 {@link TODO forum_classify 对应的类}
     */
    private Integer classify;
    /**
     * 阅读量
     */
    private Integer view;
    /**
     * 点赞量
     */
    private Integer likes;
    /**
     * 评论量
     */
    private Long comment;

}
